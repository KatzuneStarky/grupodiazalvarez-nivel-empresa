"use client"

import { socialProviders } from "@/constants/social-providers"
import { SocialProvider } from "@/types/social-provider"
import { cn } from "@/lib/utils"

export function SocialLoginButtons({
    onSocialLogin,
    isLoading,
  }: {
    onSocialLogin?: (provider: SocialProvider) => void
    isLoading: boolean
  }) {
    return (
      <div className="space-y-4">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative bg-white px-4 text-sm text-gray-500">O continua con</div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {socialProviders.map((provider) => (
            <button
              key={provider.id}
              type="button"
              onClick={() => onSocialLogin?.(provider.id)}
              disabled={isLoading}
              className={cn(
                "flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors cursor-pointer",
                provider.bgColor,
                provider.textColor,
                provider.borderColor,
              )}
              aria-label={`Sign in with ${provider.name}`}
            >
              {provider.icon}
              <span>{provider.name}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }