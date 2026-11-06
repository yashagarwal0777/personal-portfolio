import React from 'react';

export default function HobbiesSection({ data }) {
  if (!data) return null;
  const f = data.featured;

  return (
    <div className="pbody">
      {f && (
        <article className="feat">
          <span className="feat__ico" aria-hidden="true">
            {f.icon}
          </span>
          <div className="feat__body">
            {f.tagline && <span className="eyebrow">{f.tagline}</span>}
            <h2 className="feat__nm">{f.name}</h2>
            <p className="lede" dangerouslySetInnerHTML={{ __html: f.lead }} />
            {f.body && (
              <p
                className="muted"
                style={{ marginTop: 12 }}
                dangerouslySetInnerHTML={{ __html: f.body }}
              />
            )}
            {f.cuisines && f.cuisines.length > 0 && (
              <>
                <p className="feat__lbl">What I cook</p>
                <div className="tags">
                  {f.cuisines.map((c) => (
                    <span key={c.id} className="tag tag--big">
                      {c.label}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </article>
      )}

      {data.itemsTitle && (
        <h2 className="ttl" style={{ margin: '10px 0 2px 4px' }}>
          {data.itemsTitle}
        </h2>
      )}

      <div className="row2">
        {(data.items || []).map((h) => (
          <article key={h.id} className="hob">
            <span className="hob__ico" aria-hidden="true">
              {h.icon}
            </span>
            <span className="hob__nm">{h.name}</span>
            <span className="hob__d muted">{h.desc}</span>
          </article>
        ))}
      </div>

      <article className="card card--ink">
        <h2 className="ttl">{data.closingTitle}</h2>
        <p
          className="lede muted"
          style={{ marginTop: 10 }}
          dangerouslySetInnerHTML={{ __html: data.closingText }}
        />
      </article>
    </div>
  );
}
