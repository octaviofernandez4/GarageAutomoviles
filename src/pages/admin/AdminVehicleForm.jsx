import { useEffect, useState } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import { fetchAdminVehicles, createVehicle, updateVehicle } from "../../api/vehiclesAdmin.js";
import { uploadImageToCloudinary, optimizedImage } from "../../utils/cloudinary.js";
import { slugify } from "../../utils/slugify.js";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import "./AdminVehicleForm.css";

const BRANDS = ["Audi", "BMW", "Ford", "Toyota", "Volkswagen", "Chevrolet", "Peugeot", "Renault"];
const BODIES = ["SUV", "Sedán", "Hatchback", "Pick-up", "Coupé", "Familiar"];
const GEARBOXES = ["Automática", "Manual", "CVT"];
const FUELS = ["Nafta", "Diésel", "Híbrido", "Eléctrico"];
const TRACTIONS = ["4x2", "4x4", "AWD"];
const MAX_PHOTOS = 7;

const STATUSES = [
  { key: "publicado", label: "Publicado", desc: "Visible en la web" },
  { key: "borrador", label: "Borrador", desc: "Solo vos lo ves" },
  { key: "vendido", label: "Vendido", desc: "Marcado como vendido" },
];

const DEFAULT_CHECKS = [
  {
    title: "VIN y dominio auditados",
    description: "Verificación policial hecha, libre de deuda, prendas y multas al día de publicación.",
  },
  {
    title: "Historial de service",
    description: "Mantenimientos documentados en concesionario oficial hasta el último control.",
  },
  {
    title: "Peritaje de chapa y pintura",
    description: "Medición de espesor en los 12 paneles. Sin rastros de choque estructural.",
  },
  {
    title: "Test drive sin cargo",
    description: "Podés manejarla acompañada por un asesor antes de decidir.",
  },
];

const EMPTY_FORM = {
  name: "",
  brand: "",
  body: "",
  year: "",
  price: "",
  km: "",
  engine: "",
  gearbox: "",
  fuel: "",
  traction: "",
  owners: "1",
  status: "publicado",
  featured: false,
};

function formatMoney(value) {
  return `US$ ${Number(value).toLocaleString("es-AR")}`;
}

export default function AdminVehicleForm({ mode }) {
  const { id } = useParams();
  const { token } = useAdminAuth();
  const { showToast } = useOutletContext();
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [images, setImages] = useState([]);
  const [checks, setChecks] = useState(() => DEFAULT_CHECKS.map((c) => ({ ...c })));
  const [loading, setLoading] = useState(mode === "edit");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmingSave, setConfirmingSave] = useState(false);
  const [confirmingRemoveCheck, setConfirmingRemoveCheck] = useState(null);

  useEffect(() => {
    if (mode !== "edit") return;

    fetchAdminVehicles(token)
      .then((list) => {
        const vehicle = list.find((v) => v.id === id);
        if (!vehicle) {
          showToast("No encontramos ese vehículo.");
          navigate("/admin/vehiculos");
          return;
        }
        setForm({
          name: vehicle.name || "",
          brand: vehicle.brand || "",
          body: vehicle.body || "",
          year: vehicle.year ? String(vehicle.year) : "",
          price: vehicle.price ? String(vehicle.price) : "",
          km: vehicle.km ? String(vehicle.km) : "",
          engine: vehicle.engine || "",
          gearbox: vehicle.gearbox || "",
          fuel: vehicle.fuel || "",
          traction: vehicle.traction || "",
          owners: vehicle.owners != null ? String(vehicle.owners) : "1",
          status: vehicle.status || "publicado",
          featured: !!vehicle.featured,
        });
        setImages(vehicle.images || []);
        setChecks(
          vehicle.checks?.length ? vehicle.checks.map((c) => ({ ...c })) : DEFAULT_CHECKS.map((c) => ({ ...c }))
        );
      })
      .catch(() => showToast("No pudimos cargar este vehículo."))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, id]);

  const slug = mode === "create" ? slugify(form.name) || "nombre-del-auto" : id;

  const updateField = (field) => (e) => {
    const { value } = e.target;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (files.length === 0) return;

    const remaining = MAX_PHOTOS - images.length;
    if (remaining <= 0) {
      showToast(`Ya tenés el máximo de ${MAX_PHOTOS} fotos por vehículo.`);
      return;
    }

    const toUpload = files.slice(0, remaining);
    if (files.length > toUpload.length) {
      showToast(`Máximo ${MAX_PHOTOS} fotos por vehículo. Se subieron ${toUpload.length}.`);
    }

    setUploading(true);
    try {
      const uploaded = [];
      for (const file of toUpload) {
        uploaded.push(await uploadImageToCloudinary(file));
      }
      setImages((prev) => [...prev, ...uploaded]);
    } catch (err) {
      showToast(err.message);
    } finally {
      setUploading(false);
    }
  };

  const makeCover = (index) => {
    setImages((prev) => {
      const next = [...prev];
      const [item] = next.splice(index, 1);
      next.unshift(item);
      return next;
    });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const updateCheck = (index, field) => (e) => {
    const { value } = e.target;
    setChecks((prev) => prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)));
  };

  const addCheck = () => {
    setChecks((prev) => [...prev, { title: "", description: "" }]);
  };

  const removeCheck = (index) => {
    setChecks((prev) => prev.filter((_, i) => i !== index));
  };

  const confirmRemoveCheck = () => {
    if (confirmingRemoveCheck === null) return;
    removeCheck(confirmingRemoveCheck);
    setConfirmingRemoveCheck(null);
  };

  const canSave = Boolean(form.name.trim()) && Boolean(form.price);

  const helperText = !canSave
    ? "Necesitás al menos nombre y precio."
    : form.status === "publicado"
      ? "Se va a ver en la web al guardar."
      : "Queda guardado sin publicarse.";

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!canSave) {
      showToast("Falta el nombre o el precio");
      return;
    }

    if (mode === "edit") {
      setConfirmingSave(true);
      return;
    }

    saveVehicle();
  };

  const saveVehicle = async () => {
    const payload = {
      id: slug,
      name: form.name.trim(),
      brand: form.brand,
      body: form.body,
      year: form.year ? Number(form.year) : undefined,
      price: Number(form.price),
      km: form.km ? Number(form.km) : undefined,
      engine: form.engine,
      gearbox: form.gearbox,
      auto: form.gearbox !== "Manual",
      fuel: form.fuel,
      traction: form.traction,
      owners: form.owners ? Number(form.owners) : undefined,
      images,
      checks: checks.filter((c) => c.title.trim()),
      status: form.status,
      featured: form.featured,
    };

    setSubmitting(true);
    try {
      if (mode === "create") {
        await createVehicle(token, payload);
        showToast("Vehículo agregado al stock");
      } else {
        await updateVehicle(token, id, payload);
        showToast("Cambios guardados");
      }
      navigate("/admin/vehiculos");
    } catch (err) {
      showToast(err.message);
    } finally {
      setSubmitting(false);
      setConfirmingSave(false);
    }
  };

  if (loading) {
    return <p className="admin-vehicles__state">Cargando...</p>;
  }

  const previewName = form.name || "Nombre del vehículo";
  const previewMeta =
    form.brand || form.body || form.year
      ? `${form.brand || "Marca"} · ${form.body || "Carrocería"} · ${form.year || "Año"}`
      : "Marca · Carrocería · Año";
  const previewPrice = form.price ? formatMoney(form.price) : "US$ —";

  return (
    <div className="admin-vehicle-form">
      <button type="button" className="admin-vehicle-form__back" onClick={() => navigate("/admin/vehiculos")}>
        ← Volver al stock
      </button>

      <h1 className="admin-vehicle-form__title">
        {mode === "create" ? "Nuevo vehículo" : "Editar vehículo"}
      </h1>
      <p className="admin-vehicle-form__subtitle">
        Completá lo básico y guardá. Podés agregar la ficha técnica después.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="admin-vehicle-form__layout">
          <div className="admin-vehicle-form__main">
            <section className="admin-vehicle-form__card">
              <div className="admin-vehicle-form__card-head">
                <span className="admin-vehicle-form__card-num">01</span>
                <h2 className="admin-vehicle-form__card-title">Datos principales</h2>
                <span className="admin-vehicle-form__card-tag">Obligatorios</span>
              </div>

              <div className="admin-vehicle-form__grid-2">
                <label className="admin-vehicle-form__field admin-vehicle-form__field--span2">
                  <span className="mono">Nombre del vehículo</span>
                  <input value={form.name} onChange={updateField("name")} placeholder="Ej: Ford Ranger Raptor" />
                  <span className="admin-vehicle-form__hint mono">URL en la web: /stock/{slug}</span>
                </label>

                <label className="admin-vehicle-form__field">
                  <span className="mono">Marca</span>
                  <input value={form.brand} onChange={updateField("brand")} list="admin-brands" placeholder="Ford" />
                  <datalist id="admin-brands">
                    {BRANDS.map((b) => (
                      <option key={b} value={b} />
                    ))}
                  </datalist>
                </label>

                <label className="admin-vehicle-form__field">
                  <span className="mono">Carrocería</span>
                  <select value={form.body} onChange={updateField("body")}>
                    <option value="">Elegir…</option>
                    {BODIES.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="admin-vehicle-form__field">
                  <span className="mono">Año</span>
                  <input type="number" value={form.year} onChange={updateField("year")} placeholder="2023" />
                </label>

                <label className="admin-vehicle-form__field">
                  <span className="mono">Precio en dólares</span>
                  <div className="admin-vehicle-form__price-wrap">
                    <span className="admin-vehicle-form__price-prefix">US$</span>
                    <input
                      type="number"
                      value={form.price}
                      onChange={updateField("price")}
                      placeholder="42.500"
                      className="admin-vehicle-form__price-input"
                    />
                  </div>
                </label>
              </div>
            </section>

            <section className="admin-vehicle-form__card">
              <div className="admin-vehicle-form__card-head">
                <span className="admin-vehicle-form__card-num">02</span>
                <h2 className="admin-vehicle-form__card-title">Fotos</h2>
                <span className="admin-vehicle-form__card-tag">
                  {images.length > 0 ? `${images.length}/${MAX_PHOTOS} fotos` : `Sin fotos todavía (máx. ${MAX_PHOTOS})`}
                </span>
              </div>

              <p className="admin-vehicle-form__note">
                La primera foto es la portada. Arrastrá para reordenar o marcá otra como portada. Hasta{" "}
                {MAX_PHOTOS} fotos por vehículo.
              </p>

              <div className="admin-vehicle-form__photos">
                {images.map((src, i) => (
                  <div
                    key={src + i}
                    className={`admin-vehicle-form__photo ${i === 0 ? "admin-vehicle-form__photo--cover" : ""}`}
                  >
                    <img src={optimizedImage(src, 300)} alt="" />
                    <span className="admin-vehicle-form__photo-index mono">{String(i + 1).padStart(2, "0")}</span>
                    {i === 0 && <span className="admin-vehicle-form__photo-badge">Portada</span>}
                    <div className="admin-vehicle-form__photo-actions">
                      {i !== 0 && (
                        <button type="button" onClick={() => makeCover(i)}>
                          Portada
                        </button>
                      )}
                      <button type="button" onClick={() => removeImage(i)}>
                        ✕
                      </button>
                    </div>
                  </div>
                ))}

                {images.length < MAX_PHOTOS && (
                  <label className="admin-vehicle-form__upload">
                    <span className="admin-vehicle-form__upload-plus" aria-hidden="true">
                      +
                    </span>
                    {uploading ? "Subiendo..." : "Agregar fotos"}
                    <input type="file" accept="image/*" multiple onChange={handleFiles} disabled={uploading} />
                  </label>
                )}
              </div>
            </section>

            <section className="admin-vehicle-form__card">
              <div className="admin-vehicle-form__card-head">
                <span className="admin-vehicle-form__card-num">03</span>
                <h2 className="admin-vehicle-form__card-title">Ficha técnica</h2>
                <span className="admin-vehicle-form__card-tag">Opcional</span>
              </div>

              <p className="admin-vehicle-form__note">Lo que dejes vacío no aparece en la ficha del auto.</p>

              <div className="admin-vehicle-form__grid-3">
                <label className="admin-vehicle-form__field">
                  <span className="mono">Kilómetros</span>
                  <input type="number" value={form.km} onChange={updateField("km")} placeholder="35.000" />
                </label>

                <label className="admin-vehicle-form__field">
                  <span className="mono">Motor</span>
                  <input value={form.engine} onChange={updateField("engine")} placeholder="2.0 turbo nafta" />
                </label>

                <label className="admin-vehicle-form__field">
                  <span className="mono">Caja</span>
                  <select value={form.gearbox} onChange={updateField("gearbox")}>
                    <option value="">Elegir…</option>
                    {GEARBOXES.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="admin-vehicle-form__field">
                  <span className="mono">Combustible</span>
                  <select value={form.fuel} onChange={updateField("fuel")}>
                    <option value="">Elegir…</option>
                    {FUELS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="admin-vehicle-form__field">
                  <span className="mono">Tracción</span>
                  <select value={form.traction} onChange={updateField("traction")}>
                    <option value="">Elegir…</option>
                    {TRACTIONS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="admin-vehicle-form__field">
                  <span className="mono">Dueños anteriores</span>
                  <input type="number" min="0" value={form.owners} onChange={updateField("owners")} />
                </label>
              </div>
            </section>

            <section className="admin-vehicle-form__card">
              <div className="admin-vehicle-form__card-head">
                <span className="admin-vehicle-form__card-num">04</span>
                <h2 className="admin-vehicle-form__card-title">Informe de la unidad</h2>
                <span className="admin-vehicle-form__card-tag">
                  {checks.length > 0 ? `${checks.length} ítems` : "Sin ítems"}
                </span>
              </div>

              <p className="admin-vehicle-form__note">
                Estos son los puntos que ve el comprador en la ficha del auto. Se cargan con los
                de siempre, pero podés editarlos, borrarlos o agregar otros por vehículo.
              </p>

              <div className="admin-vehicle-form__checks">
                {checks.map((check, i) => (
                  <div key={i} className="admin-vehicle-form__check-row">
                    <div className="admin-vehicle-form__check-fields">
                      <input
                        value={check.title}
                        onChange={updateCheck(i, "title")}
                        placeholder="Título (ej: Historial de service)"
                        className="admin-vehicle-form__check-title"
                      />
                      <input
                        value={check.description}
                        onChange={updateCheck(i, "description")}
                        placeholder="Descripción breve"
                        className="admin-vehicle-form__check-desc"
                      />
                    </div>
                    <button
                      type="button"
                      className="admin-vehicle-form__check-remove"
                      onClick={() => setConfirmingRemoveCheck(i)}
                      aria-label="Borrar ítem"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                <button type="button" className="admin-vehicle-form__check-add" onClick={addCheck}>
                  + Agregar ítem
                </button>
              </div>
            </section>
          </div>

          <aside className="admin-vehicle-form__side">
            <div className="admin-vehicle-form__side-card">
              <span className="admin-vehicle-form__side-label mono">Así se ve en la web</span>
              <div className="admin-vehicle-form__preview">
                <div className="admin-vehicle-form__preview-photo">
                  {images[0] ? <img src={optimizedImage(images[0], 400)} alt="" /> : <span className="mono">Sin foto</span>}
                </div>
                <div className="admin-vehicle-form__preview-body">
                  <div className="admin-vehicle-form__preview-name">{previewName}</div>
                  <div className="admin-vehicle-form__preview-meta mono">{previewMeta}</div>
                  <div className="admin-vehicle-form__preview-price">{previewPrice}</div>
                </div>
              </div>
            </div>

            <div className="admin-vehicle-form__side-card">
              <span className="admin-vehicle-form__side-label mono">Publicación</span>
              <div className="admin-vehicle-form__publish-options">
                {STATUSES.map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    className={`admin-vehicle-form__publish-option admin-vehicle-form__publish-option--${s.key} ${
                      form.status === s.key ? "admin-vehicle-form__publish-option--active" : ""
                    }`}
                    onClick={() => setForm((prev) => ({ ...prev, status: s.key }))}
                  >
                    <span className="admin-vehicle-form__publish-dot" aria-hidden="true" />
                    {s.label}
                    <span className="admin-vehicle-form__publish-desc">{s.desc}</span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                className={`admin-vehicle-form__featured ${
                  form.featured ? "admin-vehicle-form__featured--active" : ""
                }`}
                onClick={() => setForm((prev) => ({ ...prev, featured: !prev.featured }))}
              >
                <span className="admin-vehicle-form__checkbox" aria-hidden="true">
                  {form.featured && "✓"}
                </span>
                Destacar en la portada
              </button>
            </div>

            <button type="submit" className="admin-vehicle-form__save" disabled={submitting || uploading}>
              {submitting ? "Guardando..." : "Guardar vehículo"}
            </button>
            <button type="button" className="admin-vehicle-form__cancel" onClick={() => navigate("/admin/vehiculos")}>
              Cancelar
            </button>
            <p className="admin-vehicle-form__helper">{helperText}</p>
          </aside>
        </div>
      </form>

      {confirmingSave && (
        <div className="admin-modal-overlay" onClick={() => setConfirmingSave(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="admin-modal__title">¿Guardar los cambios?</h2>
            <p className="admin-modal__text">
              Se van a actualizar los datos de {form.name || "este vehículo"}
              {form.status === "publicado" ? " y va a quedar visible en la web." : "."}
            </p>
            <div className="admin-modal__actions">
              <button type="button" className="admin-modal__cancel" onClick={() => setConfirmingSave(false)}>
                Cancelar
              </button>
              <button
                type="button"
                className="admin-modal__confirm admin-modal__confirm--accent"
                onClick={saveVehicle}
                disabled={submitting}
              >
                {submitting ? "Guardando..." : "Sí, guardar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmingRemoveCheck !== null && (
        <div className="admin-modal-overlay" onClick={() => setConfirmingRemoveCheck(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="admin-modal__title">¿Borrar este ítem?</h2>
            <p className="admin-modal__text">
              {checks[confirmingRemoveCheck]?.title
                ? `"${checks[confirmingRemoveCheck].title}" se va a sacar del informe de la unidad.`
                : "Este ítem del informe de la unidad se va a sacar."}
            </p>
            <div className="admin-modal__actions">
              <button type="button" className="admin-modal__cancel" onClick={() => setConfirmingRemoveCheck(null)}>
                Cancelar
              </button>
              <button type="button" className="admin-modal__confirm" onClick={confirmRemoveCheck}>
                Sí, borrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
