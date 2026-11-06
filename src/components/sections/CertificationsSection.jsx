import React from 'react';

export default function CertificationsSection({ data }) {
  if (!data) return null;

  return (
    <div className="pbody">
      <div className="row3">
        {(data.items || []).map((c) => (
          <article key={c.id} className="medal card">
            <span className="medal__disc" aria-hidden="true">
              {c.icon}
            </span>
            <h2 className="ttl ttl--sm">{c.title}</h2>
            <p className="muted" style={{ marginTop: 5 }}>
              {c.issuer} · {c.kind}
            </p>
          </article>
        ))}
      </div>

      <div className="row2">
        {(data.items || []).map((c) => (
          <article key={c.id} className="card card--lift">
            <span className="eyebrow">{c.issuer}</span>
            <h2 className="ttl">{c.title}</h2>
            <p
              className="muted"
              style={{ marginTop: 8 }}
              dangerouslySetInnerHTML={{ __html: c.desc }}
            />
            <div className="tags">
              {(c.tags || []).map((t) => (
                <span key={t.id} className="tag">
                  {t.label}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      <article className="card card--ink">
        <h2 className="ttl">{data.nextTitle}</h2>
        <p
          className="lede muted"
          style={{ marginTop: 10 }}
          dangerouslySetInnerHTML={{ __html: data.nextText }}
        />
      </article>
    </div>
  );
}
