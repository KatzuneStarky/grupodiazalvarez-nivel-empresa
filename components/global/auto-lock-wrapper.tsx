"use client"

import { useAutoLockPersisted } from "@/hooks/use-auto-look-persis";
import { KeyboardEvent, useState } from "react";

export const AutoLockWrapper = ({ children }: { children: React.ReactNode }) => {
    const { locked, unlock } = useAutoLockPersisted({ timeout: 2 * 60 * 1000 });
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [password, setPassword] = useState("")

    const handleSubmit = () => {
        if (!password.trim()) return

        setIsSubmitting(true)
        try {
            unlock(password, "1234")
        } finally {
            setIsSubmitting(false)
            setPassword("")
        }
    }

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit()
    }
  }

    return (
        <>
            {children}
            {false && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="w-full max-w-md mx-4 p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">🔒 Session bloqueada</h1>
                            <p className="text-gray-600 dark:text-gray-400">Ingrese su contraseña para continuar</p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Contraseña
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ingrese su contraseña"
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                    disabled={isSubmitting}
                                    autoFocus
                                />
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={!password.trim() || isSubmitting}
                                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center justify-center">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Desbloqueando...
                                    </div>
                                ) : (
                                    "Desbloquear pantalla"
                                )}
                            </button>
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Esta pantalla evita que use este sistema sin su autorización.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};