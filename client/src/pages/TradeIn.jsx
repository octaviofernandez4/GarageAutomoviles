import { useState } from "react";
import Button from "../components/Button/Button.jsx";
import { submitTradeIn } from "../api/tradeIn.js";
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

const ESTADOS = ["Impecable", "Muy bueno", "A reparar"];

const INITIAL_FORM = { modelo: "", anio: "", km: "", tel: "", estado: "Muy bueno", busca: "" };

export default function TradeIn() {
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
        busca: form.busca,
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
    "Un asesor te escribe por WhatsApp con el rango de tasación en menos de 24 horas hábiles.";

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

              <div className="trade-page__estado">
                <span className="mono">Estado general</span>
                <div className="trade-page__estado-chips">
                  {ESTADOS.map((estado) => (
                    <button
                      key={estado}
                      type="button"
                      className={`trade-page__chip ${form.estado === estado ? "trade-page__chip--active" : ""}`}
                      onClick={() => setForm((prev) => ({ ...prev, estado }))}
                    >
                      {estado}
                    </button>
                  ))}
                </div>
              </div>

              <div className="trade-page__field trade-page__field--busca">
                <span className="mono">Qué buscás llevarte (opcional)</span>
                <input
                  value={form.busca}
                  onChange={updateField("busca")}
                  placeholder="Ej. una SUV automática hasta US$32.000"
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
