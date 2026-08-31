import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button/Button.jsx";
import { fetchVehicleById } from "../../api/vehicles.js";
import { createVehicle, updateVehicle } from "../../api/vehiclesAdmin.js";
import { uploadImageToCloudinary } from "../../utils/cloudinary.js";
import { slugify } from "../../utils/slugify.js";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import useVehicleMeta from "../../hooks/useVehicleMeta.js";
import "./AdminVehicleForm.css";

const EMPTY_FORM = {
  id: "",
  name: "",
  brand: "",
  body: "",
  year: "",
  price: "",
  km: "",
  engine: "",
  gearbox: "",
  auto: false,
  fuel: "",
  traction: "",
  owners: "1",
  badge: "",
};

export default function AdminVehicleForm({ mode }) {
  const { id } = useParams();
  const { token } = useAdminAuth();
  const meta = useVehicleMeta();
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [images, setImages] = useState([]);
  const [idTouched, setIdTouched] = useState(mode === "edit");
  const [loading, setLoading] = useState(mode === "edit");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (mode !== "edit") return;

    fetchVehicleById(id)
      .then((vehicle) => {
        setForm({
          id: vehicle.id,
          name: vehicle.name,
          brand: vehicle.brand,
          body: vehicle.body,
          year: String(vehicle.year),
          price: String(vehicle.price),
          km: String(vehicle.km),
          engine: vehicle.engine,
          gearbox: vehicle.gearbox,
          auto: vehicle.auto,
          fuel: vehicle.fuel,
          traction: vehicle.traction,
          owners: String(vehicle.owners),
          badge: vehicle.badge,
        });
        setImages(vehicle.images || []);
      })
      .catch(() => setError("No pudimos cargar este vehículo."))
      .finally(() => setLoading(false));
  }, [mode, id]);

  const updateField = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "name" && !idTouched) {
        next.id = slugify(value);
      }
      return next;
    });
  };

  const handleIdChange = (e) => {
    setIdTouched(true);
    setForm((prev) => ({ ...prev, id: slugify(e.target.value) }));
  };

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (files.length === 0) return;

    setError("");
    setUploading(true);
    try {
      const uploaded = [];
      for (const file of files) {
        uploaded.push(await uploadImageToCloudinary(file));
      }
      setImages((prev) => [...prev, ...uploaded]);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const moveImage = (index, direction) => {
    setImages((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (images.length === 0) {
      setError("Subí al menos una foto.");
      return;
    }

    const payload = {
      ...form,
      year: Number(form.year),
      price: Number(form.price),
      km: Number(form.km),
      owners: Number(form.owners),
      images,
    };

    setSubmitting(true);
    try {
      if (mode === "create") {
        await createVehicle(token, payload);
      } else {
        await updateVehicle(token, id, payload);
      }
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="admin-vehicles__state">Cargando...</p>;
  }

  return (
    <div className="admin-vehicle-form">
      <h1 className="admin-vehicle-form__title">
        {mode === "create" ? "Nuevo vehículo" : `Editar: ${form.name}`}
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="admin-vehicle-form__grid">
          <label className="admin-vehicle-form__field">
            <span className="mono">Nombre</span>
            <input value={form.name} onChange={updateField("name")} required />
          </label>

          <label className="admin-vehicle-form__field">
            <span className="mono">ID / slug</span>
            <input
              value={form.id}
              onChange={handleIdChange}
              disabled={mode === "edit"}
              required
            />
          </label>

          <label className="admin-vehicle-form__field">
            <span className="mono">Marca</span>
            <input value={form.brand} onChange={updateField("brand")} list="brand-options" required />
            <datalist id="brand-options">
              {meta.brands.map((b) => (
                <option key={b} value={b} />
              ))}
            </datalist>
          </label>

          <label className="admin-vehicle-form__field">
            <span className="mono">Carrocería</span>
            <input value={form.body} onChange={updateField("body")} list="body-options" required />
            <datalist id="body-options">
              {meta.bodies.map((b) => (
                <option key={b} value={b} />
              ))}
            </datalist>
          </label>

          <label className="admin-vehicle-form__field">
            <span className="mono">Año</span>
            <input type="number" value={form.year} onChange={updateField("year")} required />
          </label>

          <label className="admin-vehicle-form__field">
            <span className="mono">Precio (USD)</span>
            <input type="number" value={form.price} onChange={updateField("price")} required />
          </label>

          <label className="admin-vehicle-form__field">
            <span className="mono">Kilómetros</span>
            <input type="number" value={form.km} onChange={updateField("km")} required />
          </label>

          <label className="admin-vehicle-form__field">
            <span className="mono">Motor</span>
            <input value={form.engine} onChange={updateField("engine")} required />
          </label>

          <label className="admin-vehicle-form__field">
            <span className="mono">Caja</span>
            <input value={form.gearbox} onChange={updateField("gearbox")} required />
          </label>

          <label className="admin-vehicle-form__field">
            <span className="mono">Combustible</span>
            <input value={form.fuel} onChange={updateField("fuel")} required />
          </label>

          <label className="admin-vehicle-form__field">
            <span className="mono">Tracción</span>
            <input value={form.traction} onChange={updateField("traction")} required />
          </label>

          <label className="admin-vehicle-form__field">
            <span className="mono">Dueños anteriores</span>
            <input type="number" min="0" value={form.owners} onChange={updateField("owners")} required />
          </label>

          <label className="admin-vehicle-form__field">
            <span className="mono">Badge</span>
            <input value={form.badge} onChange={updateField("badge")} required />
          </label>
        </div>

        <label className="admin-vehicle-form__checkbox">
          <input type="checkbox" checked={form.auto} onChange={updateField("auto")} />
          Caja automática
        </label>

        <div className="admin-vehicle-form__photos">
          <span className="mono">Fotos ({images.length}) — la primera es la portada</span>

          <div className="admin-vehicle-form__gallery">
            {images.map((src, i) => (
              <div key={src + i} className="admin-vehicle-form__photo">
                <img src={src} alt="" />
                {i === 0 && <span className="admin-vehicle-form__cover mono">Portada</span>}
                <div className="admin-vehicle-form__photo-actions">
                  <button type="button" onClick={() => moveImage(i, -1)} disabled={i === 0}>
                    ←
                  </button>
                  <button type="button" onClick={() => removeImage(i)}>
                    ✕
                  </button>
                  <button type="button" onClick={() => moveImage(i, 1)} disabled={i === images.length - 1}>
                    →
                  </button>
                </div>
              </div>
            ))}

            <label className="admin-vehicle-form__upload">
              {uploading ? "Subiendo..." : "+ Agregar fotos"}
              <input type="file" accept="image/*" multiple onChange={handleFiles} disabled={uploading} />
            </label>
          </div>
        </div>

        {error && <p className="admin-vehicle-form__error">{error}</p>}

        <div className="admin-vehicle-form__actions">
          <Button type="submit" variant="copper" disabled={submitting || uploading}>
            {submitting ? "Guardando..." : "Guardar"}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/admin")}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
