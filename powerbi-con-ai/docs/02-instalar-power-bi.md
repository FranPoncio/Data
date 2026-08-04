# 02 · Instalar Power BI Desktop

[⬅️ Anterior](01-que-es-y-como-usar.md) · [Índice](../README.md) · [Siguiente: Flujo con IA ➡️](03-flujo-con-ia.md)

---

**Power BI Desktop es gratis.** Solo corre en **Windows 10/11**. Si estás en Mac o Linux, mirá las alternativas más abajo.

## Opción A — Microsoft Store (recomendada)
1. Abrí **Microsoft Store**.
2. Buscá **"Power BI Desktop"**.
3. Clic en **Instalar / Obtener**.
4. Ventaja: se **actualiza solo** cada mes.

## Opción B — Descarga directa
1. Andá a `https://powerbi.microsoft.com/desktop/`.
2. **Download free** → se baja el instalador `.exe` (o `PBIDesktopSetup_x64.exe`).
3. Ejecutalo y seguí el asistente (Siguiente → Siguiente → Instalar).

## Requisitos mínimos
- Windows 10/11 (64 bits).
- 4 GB de RAM (recomendado 8+ para modelos grandes).
- ~1 GB de disco.

## ¿Mac o Linux?
Power BI Desktop **no tiene versión nativa**. Opciones:
- **Máquina virtual** de Windows (Parallels, VMware, VirtualBox).
- **Windows en la nube** (Windows 365 / Azure Virtual Desktop).
- **Power BI Service** (`app.powerbi.com`) desde el navegador: podés ver y editar informes, aunque el modelado completo es más cómodo en Desktop.

## Primer arranque
Al abrirlo por primera vez te pide iniciar sesión (opcional para trabajar local; necesario para _publicar_). La pantalla inicial tiene tres zonas clave:

- **Cinta de opciones** arriba (Inicio, Insertar, Modelado, Ver).
- **Panel de vistas** a la izquierda: 📊 Informe · 📋 Tabla · 🔗 Modelo.
- **Panel de Datos y Visualizaciones** a la derecha.

> 💡 Activá el formato moderno de proyecto: **Archivo → Opciones → Características de vista previa → "Power BI Project (.pbip)"**. Así vas a poder guardar en **TMDL** (texto) y versionarlo en Git. Ver [doc 05](05-modelo-estrella.md).

---

[⬅️ Anterior](01-que-es-y-como-usar.md) · [Índice](../README.md) · [Siguiente: Flujo con IA ➡️](03-flujo-con-ia.md)
