# Tutorial: Entrega de Tareas en GitHub desde VSCode

Este tutorial te guiará paso a paso para subir tu tarea a GitHub desde VSCode. Idealmente el repo lo armen desde 0, pero por si ya empezaron su tarea, asumiremos que ya trabajaste tu tarea en VSCode y aún no tienes un repositorio en GitHub.

## 0. Crear una cuenta en GitHub
Si aún no tienes una cuenta en GitHub, sigue estos pasos:

1. Ve a [GitHub](https://github.com/).
2. Haz clic en **Sign up** (Registrarse).
3. Completa los datos requeridos (nombre de usuario, correo electrónico y contraseña).
4. Verifica tu cuenta siguiendo las instrucciones enviadas a tu correo.

## 1. Configurar Git en tu computador
Antes de subir tu código, asegúrate de que Git esté configurado correctamente en tu máquina.

1. Abre VSCode y accede a la terminal integrada (**View > Terminal** o `Ctrl + Ñ`).
2. Verifica que Git esté instalado ejecutando:
   ```bash
   git --version
   ```
   Si no está instalado, descárgalo desde [git-scm.com](https://git-scm.com/downloads) e instálalo.
3. Configura tu nombre de usuario y correo electrónico (estos deben coincidir con los de tu cuenta de GitHub):
   ```bash
   git config --global user.name "[Tu Nombre]"
   git config --global user.email "[tuemail@example.com]"
   ```

## 2. Crear un repositorio en GitHub
1. Inicia sesión en [GitHub](https://github.com/).
2. Haz clic en el icono **+** en la esquina superior derecha y selecciona **New repository**.
3. Asigna un nombre al repositorio siguiendo este formato:
   ```
   desarrollo_web_nombre_apellido
   ```
   (Ejemplo: `desarrollo_web_juan_perez`)
   Si hay algún error de formato que no les deje poner su nombre como nombre del repo o bien no lo quieren usar, no hay problema mientras se entienda bien de quien es el repo, pueden apoyarse del archivo README.md

4. Selecciona **Public**.
5. **No marques la opción "Initialize this repository with a README"**, si es que ya tienes archivos en tu máquina.
6. Haz clic en **Create repository**.

## 3. Subir tu tarea desde VSCode
### 3.1 Abrir la carpeta del proyecto
1. En VSCode, abre la carpeta donde tienes tu tarea (**File > Open Folder**).
2. Abre la terminal integrada (**View > Terminal** o `Ctrl + Ñ`).

### 3.2 Inicializar Git y enlazar con GitHub
1. Asegúrate de estar en la carpeta correcta:
   ```bash
   cd ruta/del/proyecto
   ```
2. Inicializa un repositorio Git en la carpeta del proyecto:
   ```bash
   git init
   ```
3. Agrega la URL del repositorio remoto (cópiala desde GitHub):
   ```bash
   git remote add origin URL_DEL_REPOSITORIO
   ```

### 3.3 (Opcional pero Recomendado) Crear un archivo .gitignore

Para evitar subir archivos no deseados como entornos virtuales, carpetas de dependencias o archivos grandes, crea un archivo .gitignore en la raíz del proyecto.

1. Crea un archivo en el directorio base de tu proyecto (fuera de cualquier carpeta) llamado *.gitignore*.
2. Aquí le decimos a git que archivos NO queremos subir a github, aquí abajo se deja un ejemplo útil para sus próximas tareas (por ende opcional tarea 1 pero MUY RECOMENDADO)
   ```bash
   # Entorno virtual
   venv/
   .env

   # Archivos temporales
   *.pyc
   __pycache__/

   # Archivos de VSCode
   .vscode/

   # Subidas o contenido pesado
   uploads/

   ```

### 3.4 Crear la rama "Tarea 1" y subir los archivos
1. Crea una nueva rama para la tarea:
   ```bash
   git checkout -b "Tarea 1"
   ```
2. Agrega todos los archivos al control de versiones:
   ```bash
   git add .
   ```
3. Confirma los cambios con un mensaje descriptivo:
   ```bash
   git commit -m "Entrega de Tarea 1"
   ```
4. Sube los cambios a GitHub:
   ```bash
   git push origin Tarea 1
   ```
#### Se recomienda fuertemente apoyarse de la vista de control de versión de VSCode (Los circulos conectados debajo de la lupa a la izquierda en VSCode). Ahí pueden ver que archivos se están subiendo y dejar el mensaje de mejor manera.

## 4. Crear un archivo README.md
Es obligatorio incluir un archivo `README.md` con información sobre la tarea.

1. Crea un archivo `README.md` dentro de la carpeta del proyecto y escribe detalles como:
   ```markdown
   # Tarea 1 - Desarrollo Web
   
   ## Descripción
   Esta tarea incluye la implementación de una página HTML con CSS.
   
   ## Decisiones tomadas
   - Utilicé flexbox para organizar los elementos.
   - Agregué comentarios en el código para mayor claridad.
   ```
2. Guarda los cambios y súbelos a GitHub:
   ```bash
   git add README.md
   git commit -m "Añadir README con detalles de la tarea"
   git push origin Tarea 1
   ```

## 5. Verificar en GitHub
1. Ve a tu repositorio en GitHub.
2. Asegúrate de que la rama **Tarea 1** contiene los archivos correctamente subidos.

¡Listo! Has entregado tu tarea correctamente mediante GitHub.

Para futuras tareas pueden repetir el paso 3.3 para crear nuevas ramas. Si tienen dudas, pueden consultar la documentación de Git o GitHub. ¡Éxito con las tareas!

