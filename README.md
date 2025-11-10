-------------------- comando para crear un proyecto en nextjs -----------------------------------------
npx create-next-app@latest nombre-del-proyecto
-------------------------------------------------------------------------------------------------------

# 🚀 Guía de Inicio Rápido

## Pasos para comenzar a trabajar con el proyecto

### 1. Instalar dependencias

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
npm install
```

### 2. Iniciar el servidor de desarrollo

```bash
npm run dev
```

El proyecto estará disponible en: http://localhost:3000

### 3. Estructura del código

#### Crear una nueva página
Crea un archivo en la carpeta `app/` con el nombre de la ruta:
```
app/about/page.tsx  → http://localhost:3000/about
```

#### Crear un componente reutilizable
Añade componentes en `components/`:
```
components/ui/MyComponent.tsx
```

#### Añadir estilos
- Usa clases de Tailwind CSS directamente en tus componentes
- Los estilos globales están en `app/globals.css`

### 4. Comandos útiles

```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm run start

# Linting
npm run lint
```

### 5. Próximos pasos

1. ✅ Personaliza los colores en `tailwind.config.ts`
2. ✅ Modifica el contenido de `app/page.tsx`
3. ✅ Añade tus propias rutas en la carpeta `app/`
4. ✅ Crea componentes personalizados en `components/`
5. ✅ Configura las variables de entorno copiando `.env.example` a `.env.local`

### 6. Recursos útiles

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [Documentación de TypeScript](https://www.typescriptlang.org/docs)

### 7. Configuración de VS Code

Instala estas extensiones para una mejor experiencia de desarrollo:
- ESLint
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features

---

¡Feliz desarrollo! 🎉