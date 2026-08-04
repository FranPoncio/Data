# 08 · Publicar y compartir

[⬅️ Anterior](07-visuales-y-diseno.md) · [Índice](../README.md)

---

## Publicar en Power BI Service
1. En Desktop: **Inicio → Publicar**.
2. Iniciá sesión con tu cuenta de trabajo/estudio.
3. Elegí el **área de trabajo** (workspace) destino.
4. Listo: el informe queda en `app.powerbi.com`.

> ⚠️ **Necesitás una cuenta organizacional** (no sirve gmail/hotmail personal para publicar). Muchas universidades y empresas ya la tienen.

## Licencias (resumen)
| Licencia | Qué permite | Costo |
|----------|-------------|-------|
| **Desktop** | Crear informes local | Gratis |
| **Free (Service)** | Publicar en tu área personal, sin compartir | Gratis |
| **Pro** | Compartir y colaborar | Mensual por usuario |
| **Premium / Fabric** | Grandes volúmenes, capacidad dedicada | Por capacidad |

Para practicar y aprender, **Desktop + Free** te alcanza.

## Actualización automática de datos
Si tus datos están en un origen que cambia (Excel en SharePoint, SQL, etc.):
1. En el Service, entrá al **conjunto de datos (semantic model)**.
2. **Configuración → Actualización programada**.
3. Definí frecuencia (ej. diaria).
4. Para orígenes locales necesitás un **Gateway** (puente de datos on-premise).

## Compartir
- **Compartir el informe** directo (link) — requiere Pro del que comparte y del que recibe.
- **Publicar en la web** (público, ¡ojo con datos sensibles!): **Archivo → Insertar informe → Publicar en la web**.
- **Exportar a PDF/PowerPoint** para mandar por mail: **Exportar** en la barra del Service.
- **App de Power BI**: empaquetás varios informes para un público amplio.

## Buenas prácticas de gobierno
- Separá **workspace de desarrollo** y de **producción**.
- Versioná el `.pbip` en **Git** (ver [doc 05](05-modelo-estrella.md)).
- Documentá las medidas (descripción en cada medida).
- Configurá **RLS (Row-Level Security)** si distintos usuarios deben ver distintos datos: **Modelado → Administrar roles**.

---

🎉 **Con esto cerrás el círculo completo:** datos → modelo → DAX → visuales → publicado y actualizándose solo.

[⬅️ Anterior](07-visuales-y-diseno.md) · [Volver al índice](../README.md)
