
# Pixie Frontend

## ¿Qué es este proyecto?

Este frontend está orientado a la gestión y dinamización de eventos presenciales, como ferias, exposiciones o congresos. Su propósito principal es digitalizar la experiencia de los asistentes y organizadores, facilitando la interacción, la comunicación y la gamificación durante el evento.

### ¿Qué negocio cumple este frontend?

- **Gestión de asistentes:** Permite registrar, notificar y segmentar a los participantes del evento.
- **Anuncios y comunicación:** Los organizadores pueden enviar anuncios y notificaciones en tiempo real a los asistentes.
- **Sorteos y dinámicas:** Incluye módulos para realizar sorteos masivos y actividades interactivas, incentivando la participación.
- **Gamificación y rankings:** Presenta rankings de stands más visitados y otras métricas para motivar la interacción.
- **Paneles y dashboards:** Ofrece interfaces para visualizar y administrar las diferentes secciones del evento (anuncios, sorteos, asistentes, stands).

En resumen, este frontend digitaliza y potencia la gestión de eventos presenciales, mejorando la experiencia de asistentes y organizadores mediante herramientas de comunicación, gamificación y administración en tiempo real.

---

## Tecnologías principales

- **React** (estructura de componentes)
- **Vite** (bundler y servidor de desarrollo)
- **Tailwind CSS** (utilidades de estilos)
- **PostCSS** (procesamiento de CSS)
- **ESLint** (linter de JavaScript)

## Estructura de carpetas

```
src/
	App.css, index.css, main.jsx
	app/
		App.jsx
		assets/
		core/
			constants/
			hooks/
		features/
			home/
				components/
					Header.jsx
					SectionLayout.jsx
					TabContent.jsx
					TabNavigation.jsx
					tabs/
						AnunciosContent.jsx
						AsistentesContent.jsx
						EventoModal.jsx
						SorteosContent.jsx
						StandsMasVisitadosContent.jsx
						anuncios/
						asistentes/
						sorteos/
				pages/
					Home.jsx
		lib/
			api.js
			utils.js
		notifications/
			NotificationProvider.jsx
			notifications.messages.js
			notificationService.js
		styles/
			globals.css
public/
	_redirects
	staticwebapp.config.json
	Camisetas/
```

## Configuración y scripts

- `package.json`: Dependencias y scripts de npm.
- `vite.config.js`: Configuración de Vite.
- `tailwind.config.js` y `postcss.config.js`: Configuración de Tailwind y PostCSS.
- `eslint.config.js`: Reglas de linting.

---

## Pasos para levantar el proyecto

1. **Clona el repositorio:**
	 ```bash
	 git clone <url-del-repo>
	 cd pixie
	 ```

2. **Instala las dependencias:**
	 ```bash
	 npm install
	 ```

3. **Inicia el servidor de desarrollo:**
	 ```bash
	 npm run dev
	 ```
	 El proyecto estará disponible normalmente en [http://localhost:5173](http://localhost:5173)

4. **Comandos útiles:**
	 - `npm run build`: Genera la build de producción.
	 - `npm run preview`: Previsualiza la build de producción.
	 - `npm run lint`: Ejecuta el linter para revisar el código.

---

¿Dudas? Consulta con el equipo de desarrollo o revisa la documentación interna.
