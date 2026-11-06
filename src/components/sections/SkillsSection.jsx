import React, { useState, useEffect } from 'react';

export default function SkillsSection({ data }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimated(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  if (!data) return null;

  return (
    <div className="pbody">
      <article className="card">
        <span className="eyebrow">Core loadout</span>
        <h2 className="ttl">{data.barsTitle}</h2>
        {(data.bars || []).map((bar) => (
          <div key={bar.id} className="sk">
            <div className="sk__top">
              <span className="sk__nm">{bar.name}</span>
              <span className="sk__v">{bar.value}%</span>
            </div>
            <div className="sk__track">
              <i
                className="sk__fill"
                style={{
                  width: animated ? `${bar.value}%` : '0%',
                  transition: 'width 1s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              />
            </div>
          </div>
        ))}
      </article>

      <div className="row2">
        {(data.groups || []).map((grp) => (
          <article key={grp.id} className="card card--lift">
            <span className="eyebrow">{grp.eyebrow}</span>
            <h3 className="ttl ttl--sm">{grp.title}</h3>
            <div className="tags">
              {(grp.tags || []).map((tag) => (
                <span key={tag.id} className="tag">
                  {tag.label}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      <article className="card card--ink">
        <h2 className="ttl">{data.excelTitle}</h2>
        <p
          className="lede muted"
          style={{ marginTop: 10 }}
          dangerouslySetInnerHTML={{ __html: data.excelText }}
        />
      </article>

      <article className="card card--tint">
        <h2 className="ttl">{data.traitsTitle}</h2>
        <div className="tags">
          {(data.traits || []).map((t) => (
            <span key={t.id} className="tag">
              {t.label}
            </span>
          ))}
        </div>
        {data.note && <p className="note" style={{ marginTop: 14, fontSize: 12, opacity: 0.65 }}>{data.note}</p>}
      </article>
    </div>
  );
}
