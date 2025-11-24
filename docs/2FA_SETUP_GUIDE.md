# Guía de Configuración de Autenticación de Dos Factores (2FA)

Esta guía te ayudará a configurar la autenticación de dos factores basada en SMS en tu aplicación Firebase.

## 📋 Requisitos Previos

- Proyecto de Firebase configurado
- Acceso a la consola de Firebase
- Dominio verificado para reCAPTCHA
- Presupuesto para SMS (Firebase cobra por cada mensaje enviado)

---

## 🔧 Configuración en Firebase Console

### 1. Habilitar Multi-Factor Authentication (MFA)

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. En el menú lateral, ve a **Authentication** → **Settings**
4. Desplázate hasta la sección **Multi-factor authentication**
5. Haz clic en **Enable** para activar MFA
6. Selecciona **SMS** como método de segundo factor
7. Guarda los cambios

![Firebase MFA Settings](https://firebase.google.com/docs/auth/web/phone-auth)

### 2. Habilitar Phone Authentication

1. En **Authentication** → **Sign-in method**
2. Busca **Phone** en la lista de proveedores
3. Haz clic en **Phone** para expandir
4. Activa el toggle **Enable**
5. Guarda los cambios

> ⚠️ **Importante**: Phone Authentication debe estar habilitado incluso si no lo usas como método principal de inicio de sesión.

### 3. Configurar reCAPTCHA

Firebase utiliza reCAPTCHA para prevenir abuso en la verificación por SMS.

#### Opción A: reCAPTCHA Invisible (Recomendado)

El código ya está configurado para usar reCAPTCHA invisible. Solo necesitas:

1. Ve a [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
2. Crea un nuevo sitio con las siguientes configuraciones:
   - **Tipo**: reCAPTCHA v2 (Invisible)
   - **Dominios**: Agrega tu dominio (ej: `tuapp.com`, `localhost` para desarrollo)
3. Copia la **Site Key** y **Secret Key**
4. En Firebase Console, ve a **Authentication** → **Settings** → **Authorized domains**
5. Agrega tus dominios autorizados

#### Opción B: reCAPTCHA v3

Si prefieres reCAPTCHA v3:

1. Modifica el hook `use-two-factor.ts`:

```typescript
const verifier = new RecaptchaVerifier(auth, elementId, {
  size: "invisible",
  callback: () => {
    // reCAPTCHA solved
  },
  "recaptcha-v3-site-key": "TU_SITE_KEY_AQUI",
});
```

### 4. Configurar Dominios Autorizados

1. En **Authentication** → **Settings** → **Authorized domains**
2. Agrega los dominios donde tu app estará desplegada:
   - `localhost` (para desarrollo)
   - Tu dominio de producción (ej: `tuapp.com`)
   - Tu dominio de staging si lo tienes

### 5. Configurar Plantilla de SMS (Opcional)

1. Ve a **Authentication** → **Templates**
2. Selecciona **SMS verification**
3. Personaliza el mensaje que recibirán los usuarios:

```
Tu código de verificación para [APP_NAME] es: %CODE%
```

---

## 💰 Costos de SMS

Firebase utiliza Twilio para enviar SMS. Los costos varían por país:

| Región         | Costo aproximado por SMS |
| -------------- | ------------------------ |
| México         | $0.0075 USD              |
| Estados Unidos | $0.0075 USD              |
| España         | $0.0085 USD              |
| América Latina | $0.01 - $0.02 USD        |

> 💡 **Tip**: Firebase incluye un pequeño crédito gratuito mensual. Consulta los [precios actuales](https://firebase.google.com/pricing).

### Configurar Presupuesto

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona tu proyecto de Firebase
3. Ve a **Billing** → **Budgets & alerts**
4. Crea un presupuesto para controlar gastos de SMS

---

## 🧪 Pruebas en Desarrollo

### Números de Teléfono de Prueba

Para evitar costos durante el desarrollo:

1. En Firebase Console, ve a **Authentication** → **Settings**
2. Desplázate hasta **Phone numbers for testing**
3. Agrega números de prueba con códigos de verificación fijos:
   - Número: `+52 1234567890`
   - Código: `123456`

Estos números no enviarán SMS reales y siempre aceptarán el código configurado.

### Probar en Localhost

1. Asegúrate de que `localhost` esté en los dominios autorizados
2. Usa números de prueba configurados en Firebase
3. El reCAPTCHA invisible debería funcionar automáticamente

---

## 🚀 Despliegue a Producción

### Checklist Pre-Despliegue

- [ ] MFA habilitado en Firebase
- [ ] Phone Authentication habilitado
- [ ] reCAPTCHA configurado para tu dominio de producción
- [ ] Dominio de producción agregado a dominios autorizados
- [ ] Presupuesto de SMS configurado
- [ ] Plantilla de SMS personalizada (opcional)
- [ ] Números de prueba removidos o documentados

### Variables de Entorno

Si usas reCAPTCHA v3, agrega a tu `.env`:

```bash
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=tu_site_key_aqui
```

---

## 🔍 Verificación de Configuración

### Test Rápido

1. Ve a tu perfil de usuario
2. Navega a la pestaña **Seguridad**
3. Haz clic en **Habilitar 2FA**
4. Ingresa un número de teléfono (usa un número de prueba si estás en desarrollo)
5. Deberías recibir un SMS con el código de verificación
6. Ingresa el código para completar la configuración

### Solución de Problemas Comunes

#### Error: "reCAPTCHA verification failed"

- Verifica que tu dominio esté en la lista de dominios autorizados
- Asegúrate de que reCAPTCHA esté correctamente configurado
- Revisa la consola del navegador para errores específicos

#### Error: "auth/invalid-phone-number"

- El número debe estar en formato E.164 (ej: `+521234567890`)
- Verifica que el código de país sea correcto

#### Error: "auth/quota-exceeded"

- Has excedido el límite de SMS gratuitos
- Configura un método de pago en Google Cloud Console

#### No recibo el SMS

- Verifica que Phone Authentication esté habilitado
- Confirma que el número sea válido
- Revisa los logs en Firebase Console → Authentication → Usage

---

## 📱 Uso de la Funcionalidad

### Para Usuarios

#### Habilitar 2FA

1. Inicia sesión en tu cuenta
2. Ve a tu perfil → Pestaña **Seguridad**
3. Haz clic en **Habilitar 2FA**
4. Ingresa tu número de teléfono en formato internacional
5. Recibirás un SMS con un código de 6 dígitos
6. Ingresa el código para completar la configuración

#### Iniciar Sesión con 2FA

1. Ingresa tu correo y contraseña normalmente
2. Si tienes 2FA habilitado, se te pedirá un código
3. Recibirás un SMS con el código de verificación
4. Ingresa el código para completar el inicio de sesión

#### Deshabilitar 2FA

1. Ve a tu perfil → Pestaña **Seguridad**
2. En la tarjeta de 2FA, haz clic en el ícono de eliminar (🗑️)
3. Confirma la acción

---

## 🔐 Mejores Prácticas de Seguridad

1. **Números de Respaldo**: Permite a los usuarios registrar múltiples números
2. **Códigos de Recuperación**: Implementa códigos de respaldo para casos de pérdida de teléfono
3. **Dispositivos Confiables**: Considera permitir que los usuarios marquen dispositivos como confiables
4. **Notificaciones**: Envía notificaciones por correo cuando se habilite/deshabilite 2FA
5. **Rate Limiting**: Implementa límites de intentos para prevenir ataques de fuerza bruta
6. **Logs de Seguridad**: Registra todos los eventos relacionados con 2FA

---

## 📚 Recursos Adicionales

- [Documentación oficial de Firebase Phone Auth](https://firebase.google.com/docs/auth/web/phone-auth)
- [Documentación de Multi-Factor Authentication](https://firebase.google.com/docs/auth/web/multi-factor)
- [reCAPTCHA Documentation](https://developers.google.com/recaptcha)
- [Twilio Pricing](https://www.twilio.com/sms/pricing)

---

## 🆘 Soporte

Si encuentras problemas:

1. Revisa los logs en Firebase Console
2. Verifica la consola del navegador para errores
3. Consulta la sección de solución de problemas arriba
4. Revisa los issues en el repositorio del proyecto
