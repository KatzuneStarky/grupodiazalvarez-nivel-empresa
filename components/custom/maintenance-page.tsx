"use client"

import { Button } from '../ui/button'

const MaintenancePage = () => {
    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1">
            <div className="absolute right-0 top-0 -z-1 w-full max-w-[250px] xl:max-w-[450px]">
                <img alt="grid" loading="lazy" width="540" height="254" decoding="async" data-nimg="1" src="/grid-01.svg" />
            </div>
            <div className="absolute bottom-0 left-0 -z-1 w-full max-w-[250px] rotate-180 xl:max-w-[450px]">
                <img alt="grid" loading="lazy" width="540" height="254" decoding="async" data-nimg="1" src="/grid-01.svg" /></div>
            <div>
                <div className="mx-auto w-full max-w-2xl text-center sm:max-w-4xl">
                    <div className="mx-auto mb-10 w-full max-w-2xl text-center sm:max-w-4xl">
                        <div className='mx-auto place-self-center'>
                            <img alt="maintenance" loading="lazy" width="205" height="205" decoding="async" data-nimg="1" className="dark:hidden block" src="/maintenance-dark.svg" />
                            <img alt="maintenance" loading="lazy" width="205" height="205" decoding="async" data-nimg="1" className="hidden dark:block" src="/maintenance-dark.svg" />
                        </div>
                        <h1 className="mb-2 font-bold text-gray-800 text-title-md dark:text-white/90 xl:text-2xl">EN MANTENIMIENTO</h1>
                        <p className="mt-6 mb-6 text-base text-gray-700 dark:text-gray-400 sm:text-lg">
                            Este modulo se encuentra en mantenimiento por el momento,
                            volvera a estar disponible en breve.
                        </p>
                        <div className='flex gap-4 items-center justify-center'>
                            <Button className="inline-flex items-center justify-center rounded-lg border 
                                border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 
                                shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 
                                dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03] 
                                dark:hover:text-gray-200 h-full">
                                Contactar al administrador
                            </Button>
                            <a className="inline-flex items-center justify-center rounded-lg border 
                                border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 
                                shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 
                                dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03] 
                                dark:hover:text-gray-200" href="/">
                                Regresar al inicio
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MaintenancePage