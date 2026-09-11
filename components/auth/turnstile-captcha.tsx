"use client"

import { useEffect, useId, useRef } from "react"

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string
          theme: "light" | "dark" | "auto"
          callback: (token: string) => void
          "expired-callback": () => void
          "error-callback": () => void
        },
      ) => string
      remove: (widgetId: string) => void
    }
  }
}

interface TurnstileCaptchaProps {
  siteKey: string
  onVerify: (token: string) => void
  onError: () => void
}

export function TurnstileCaptcha({ siteKey, onVerify, onError }: TurnstileCaptchaProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const scriptId = useId().replace(/:/g, "")

  useEffect(() => {
    const renderWidget = () => {
      if (!containerRef.current || !window.turnstile || widgetIdRef.current) return

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        theme: "auto",
        callback: onVerify,
        "expired-callback": onError,
        "error-callback": onError,
      })
    }

    const existingScript = document.querySelector<HTMLScriptElement>('script[src^="https://challenges.cloudflare.com/turnstile/"]')
    if (existingScript) {
      existingScript.addEventListener("load", renderWidget)
      renderWidget()
    } else {
      const script = document.createElement("script")
      script.id = `turnstile-${scriptId}`
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
      script.async = true
      script.defer = true
      script.addEventListener("load", renderWidget)
      document.head.appendChild(script)
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
      }
      widgetIdRef.current = null
    }
  }, [onError, onVerify, scriptId, siteKey])

  return <div ref={containerRef} aria-label="Spam protection verification" />
}
