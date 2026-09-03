import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Button from "../components/Button/Button.jsx";
import { submitTradeIn } from "../api/tradeIn.js";
import useVehicles from "../hooks/useVehicles.js";
import "./TradeIn.css";

const STEPS = [
  {
    num: "01",
    title: "Cargás los datos",
    desc: "Modelo, año, kilómetros y estado general. Dos minutos.",
  },
  {
    num: "02",
    title: "Tasamos en 24 h",
    desc: "Cruzamos el valor con lo que se está pagando hoy en la plaza local.",
  },
  {
    num: "03",
    title: "Te mostramos opciones",
    desc: "Qué unidades del stock podés llevarte usando tu auto como anticipo.",
  },
];

function ShieldCheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6l7-3z" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ThumbsUpIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M7 11v10H4a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h3z" />
      <path d="M7 11l4-7a2 2 0 0 1 2 2v3h5a2 2 0 0 1 2 2.3l-1.3 6A2 2 0 0 1 17 19H9" />
    </svg>
  );
}

function WrenchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M14.7 6.3a3.5 3.5 0 0 0-4.6 4.6L3 18l3 3 7.1-7.1a3.5 3.5 0 0 0 4.6-4.6l-2.5 2.5-2-2 2.5-2.5z" />
    </svg>
  );
}

function GarageIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 21V9l8-5 8 5v12" />
      <path d="M9 21v-7h6v7" strokeLinejoin="round" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.5 20c.6-3.8 4-6 7.5-6s6.9 2.2 7.5 6" strokeLinecap="round" />
    </svg>
  );
}

function NoneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M6.5 6.5l11 11" strokeLinecap="round" />
    </svg>
  );
}

const ESTADOS = [
  { key: "Impecable", icon: ShieldCheckIcon },
  { key: "Muy bueno", icon: ThumbsUpIcon },
  { key: "A reparar", icon: WrenchIcon },
];

const HISTORIALES = [
  { key: "Oficial", desc: "Taller de la marca", icon: GarageIcon },
  { key: "Particular", desc: "Talleres independientes", icon: PersonIcon },
  { key: "Ninguno", desc: "Sin registros", icon: NoneIcon },
];

const NEUMATICOS = ["Gastados", "Pobres", "Regulares", "Buenos", "Nuevos"];

const INITIAL_FORM = {
  modelo: "",
  anio: "",
  km: "",
  tel: "",
  estado: "Muy bueno",
  historial: "Oficial",
  neumaticos: "Buenos",
  busca: "",
  detalles: "",
};

export default function TradeIn() {
  const [searchParams] = useSearchParams();
  const autoId = searchParams.get("auto");
  const { vehicles } = useVehicles();
  const targetVehicle = autoId ? vehicles.find((v) => v.id === autoId) : null;

  const [form, setForm] = useState(INITIAL_FORM);
  const [sent, setSent] = useState(false);
  const [sentModelo, setSentModelo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const updateField = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await submitTradeIn({
        modelo: form.modelo,
        anio: form.anio,
        km: form.km,
        telefono: form.tel,
        estado: form.estado,
        historial: form.historial,
        neumaticos: form.neumaticos,
        busca: form.busca,
        detalles: form.detalles,
        vehiculoId: targetVehicle?.id,
        vehiculoNombre: targetVehicle?.name,
      });
      setSentModelo(form.modelo);
      setSent(true);
    } catch (err) {
      setError("No pudimos enviar tu pedido. Probá de nuevo en unos minutos.");
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setForm(INITIAL_FORM);
    setSent(false);
    setError("");
  };

  const sentLine =
    (sentModelo ? `Ya tenemos los datos del ${sentModelo}. ` : "") +
    (targetVehicle
      ? `Un asesor te escribe para avanzar con el ${targetVehicle.name} en menos de 24 horas hábiles.`
      : "Un asesor te escribe por WhatsApp con el rango de tasación en menos de 24 horas hábiles.");

  const neumaticoIndex = NEUMATICOS.indexOf(form.neumaticos);

  return (
    <main className="trade-page">
      <div className="container trade-page__grid">
        <div>
          <div className="overline">Tasá tu usado</div>
          <h1 className="trade-page__title">
            Decinos qué
            <br />
            tenés y te
            <br />
            damos un número
          </h1>
          <p className="trade-page__intro">
            Respondemos en menos de 24 horas hábiles con un rango de tasación real, y qué
            unidades del stock podés llevarte con eso como anticipo.
          </p>
          <div className="trade-page__steps">
            {STEPS.map((step) => (
              <div key={step.num} className="trade-page__step">
                <span className="trade-page__step-num mono">{step.num}</span>
                <div>
                  <div className="trade-page__step-title">{step.title}</div>
                  <div className="trade-page__step-desc">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="trade-page__panel">
          {!sent && (
            <form onSubmit={handleSubmit}>
              <h2 className="trade-page__form-title">Datos de tu vehículo</h2>

              {targetVehicle && (
                <div className="trade-page__target">
                  <span className="mono">Vas a entregar tu usado para comprar</span>
                  <strong>{targetVehicle.name}</strong>
                </div>
              )}

              <div className="trade-page__section-label mono">1. Datos básicos</div>
              <div className="trade-page__fields">
                <div className="trade-page__field">
                  <span className="mono">Marca y modelo</span>
                  <input
                    value={form.modelo}
                    onChange={updateField("modelo")}
                    placeholder="Ej. VW Polo Trendline"
                    required
                  />
                </div>
                <div className="trade-page__field">
                  <span className="mono">Año</span>
                  <input value={form.anio} onChange={updateField("anio")} placeholder="2019" required />
                </div>
                <div className="trade-page__field">
                  <span className="mono">Kilómetros</span>
                  <input value={form.km} onChange={updateField("km")} placeholder="78.000" />
                </div>
                <div className="trade-page__field">
                  <span className="mono">WhatsApp</span>
                  <input
                    value={form.tel}
                    onChange={updateField("tel")}
                    placeholder="381 000 0000"
                    required
                  />
                </div>
              </div>

              <div className="trade-page__section-label mono">2. Estado detallado</div>
              <div className="trade-page__option-group">
                <span className="mono">Estado general</span>
                <div className="trade-page__option-cards">
                  {ESTADOS.map(({ key, icon: Icon }) => (
                    <button
                      key={key}
                      type="button"
                      className={`trade-page__option-card ${form.estado === key ? "trade-page__option-card--active" : ""}`}
                      onClick={() => setForm((prev) => ({ ...prev, estado: key }))}
                    >
                      <Icon />
                      <span>{key}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="trade-page__section-label mono">3. Detalles avanzados</div>
              <div className="trade-page__option-group">
                <span className="mono">Historial de service</span>
                <div className="trade-page__option-cards">
                  {HISTORIALES.map(({ key, desc, icon: Icon }) => (
                    <button
                      key={key}
                      type="button"
                      className={`trade-page__option-card ${form.historial === key ? "trade-page__option-card--active" : ""}`}
                      onClick={() => setForm((prev) => ({ ...prev, historial: key }))}
                    >
                      <Icon />
                      <span>{key}</span>
                      <small>{desc}</small>
                    </button>
                  ))}
                </div>
              </div>

              <div className="trade-page__option-group">
                <span className="mono">Condición de neumáticos</span>
                <div className="trade-page__tires">
                  <input
                    type="range"
                    min={0}
                    max={NEUMATICOS.length - 1}
                    step={1}
                    value={neumaticoIndex}
                    onChange={(e) => setForm((prev) => ({ ...prev, neumaticos: NEUMATICOS[Number(e.target.value)] }))}
                  />
                  <div className="trade-page__tires-labels">
                    {NEUMATICOS.map((label, i) => (
                      <span key={label} className={i === neumaticoIndex ? "trade-page__tires-label--active" : ""}>
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {!targetVehicle && (
                <div className="trade-page__field trade-page__field--busca">
                  <span className="mono">Qué buscás llevarte (opcional)</span>
                  <input
                    value={form.busca}
                    onChange={updateField("busca")}
                    placeholder="Ej. una SUV automática hasta US$32.000"
                  />
                </div>
              )}

              <div className="trade-page__field trade-page__field--busca">
                <span className="mono">Algún detalle más (opcional)</span>
                <textarea
                  value={form.detalles}
                  onChange={updateField("detalles")}
                  placeholder="Ej. tiene un golpe leve en la puerta trasera, service al día, dueño único..."
                  rows={3}
                />
              </div>

              <Button type="submit" variant="copper" className="trade-page__submit" disabled={submitting}>
                {submitting ? "Enviando..." : "Pedir tasación"}
              </Button>
              {error && <p className="trade-page__error">{error}</p>}
              <p className="trade-page__legal">Te contactamos solo por este vehículo. No compartimos tus datos.</p>
            </form>
          )}

          {sent && (
            <div className="trade-page__confirm">
              <div className="trade-page__check">✓</div>
              <h2 className="trade-page__confirm-title">Pedido enviado</h2>
              <p className="trade-page__confirm-line">{sentLine}</p>
              <div className="trade-page__confirm-actions">
                <Button to="/stock" variant="copper" className="trade-page__confirm-btn">
                  Mirar el stock
                </Button>
                <Button variant="outline" className="trade-page__confirm-btn" onClick={reset}>
                  Cargar otro vehículo
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
