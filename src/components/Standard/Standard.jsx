import "./Standard.css";

const STANDARDS = [
  {
    
    title: "Historial verificado, no declarado",
    desc: "Auditamos VIN, dominio, deuda de patentes e infracciones antes de publicar. El informe se te entrega impreso.",
  },
  {
    
    title: "Precio publicado y final",
    desc: "Lo que ves es lo que pagás: transferencia y verificación policial incluidas en el valor.",
  },
  {
    
    title: "Financiación propia y bancaria",
    desc: "Armamos el plan con lo que puedas poner de anticipo. Aprobación crediticia en el día.",
  },
  {
    
    title: "Tomamos tu usado",
    desc: "Tasación a valor real de mercado en Tucumán, sin descuentos sorpresa el día de la entrega.",
  },
];

export default function Standard() {
  return (
    <section className="standard">
      <div className="container">
        <div className="standard__grid">
          <div>          
            <h2 className="standard__title">
              El estándar
              <br />
              de la casa
            </h2>
            <p className="standard__intro">
              Cuatro reglas que no negociamos, y que son la razón por la que la mayoría de nuestras
              ventas vienen por recomendación.
            </p>
          </div>
          <div>
            {STANDARDS.map((item) => (
              <div key={item.num} className="standard__row">
                <span className="standard__num mono">{item.num}</span>
                <div>
                  <h3 className="standard__row-title">{item.title}</h3>
                  <p className="standard__row-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
