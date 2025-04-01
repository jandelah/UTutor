# UTutor

## Descripción
UTutor es una plataforma de asesoría académica entre pares que conecta estudiantes avanzados (tutores) con estudiantes que buscan apoyo académico (tutorados) en la Universidad Tecnológica de San Juan del Río.

El proyecto se enfoca en fomentar la colaboración, el desarrollo de habilidades de liderazgo en tutores, y mejorar el rendimiento académico de los tutorados.

## Características principales
- Sistema de perfiles para tutores y tutorados
- Algoritmo de emparejamiento basado en áreas de interés/experiencia
- Programación y seguimiento de sesiones de tutoría
- Biblioteca de recursos educativos compartidos
- Seguimiento de progreso y estadísticas
- Sistema de evaluación bidireccional

## Capturas de pantalla
### Página de inicio
![Página de inicio](docs/screenshots/home.png)

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)

### Perfil de usuario
![Perfil de usuario](docs/screenshots/profile.png)

## Estructura del proyecto
- `/frontend`: Aplicación React para interfaz de usuario
  - `/src/components`: Componentes reutilizables
  - `/src/pages`: Páginas principales
  - `/src/services`: Servicios para interacción con API
  - `/src/hooks`: Custom Hooks de React
  - `/src/utils`: Utilidades y funciones auxiliares
- `/backend`: API REST con Node.js y Express (en desarrollo)
- `/docs`: Documentación, wireframes y especificaciones

## Configuración de desarrollo

### Frontend
```bash
cd frontend
npm install
npm run dev
```
