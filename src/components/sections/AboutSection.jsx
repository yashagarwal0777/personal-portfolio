import React from 'react';

export default function AboutSection({ data }) {
  if (!data) return null;

  return (
    <div className="pbody">
      <article className="card">
        <span className="eyebrow">The short version</span>
        <p
          className="lede"
          dangerouslySetInnerHTML={{ __html: data.lede }}
        />
      </article>

      <div className="row2">
        <article className="card card--lift">
          <h2 className="ttl">{data.doingTitle}</h2>
          <ul className="ul">
            {(data.doing || []).map((item) => (
              <li
                key={item.id}
                dangerouslySetInnerHTML={{ __html: item.text }}
              />
            ))}
          </ul>
        </article>

        <article className="card card--tint">
          <h2 className="ttl">{data.factsTitle}</h2>
          <div className="kvs">
            {(data.facts || []).map((fact) => (
              <div key={fact.id} className="kv">
                <span>{fact.k}</span>
                <b>{fact.v}</b>
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="row3">
        {(data.stats || []).map((stat) => (
          <div key={stat.id} className="stat">
            <b>{stat.value}</b>
            {stat.suffix && <i>{stat.suffix}</i>}
            <span>{stat.label}</span>
          </div>
        ))}
      </div>

      <article className="card card--ink">
        <h2 className="ttl">{data.storyTitle}</h2>
        <p
          className="lede muted"
          style={{ marginTop: 10 }}
          dangerouslySetInnerHTML={{ __html: data.story }}
        />
        <div className="tags">
          {(data.storyTags || []).map((t) => (
            <span key={t.id} className="tag">
              {t.label}
            </span>
          ))}
        </div>
      </article>

      <article className="card">
        <span className="eyebrow">Working style</span>
        <p className="lede" dangerouslySetInnerHTML={{ __html: data.motto }} />
        <p
          className="muted"
          style={{ marginTop: 10 }}
          dangerouslySetInnerHTML={{ __html: data.mottoNote }}
        />
      </article>
    </div>
  );
}
