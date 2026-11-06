import React from 'react';

export default function EducationSection({ data }) {
  if (!data) return null;

  return (
    <div className="pbody">
      <div className="row3">
        {(data.stats || []).map((stat) => (
          <div key={stat.id} className="stat">
            <b>{stat.value}</b>
            {stat.suffix && <i>{stat.suffix}</i>}
            <span>{stat.label}</span>
          </div>
        ))}
      </div>

      {(data.entries || []).map((entry) => (
        <article key={entry.id} className="card card--lift">
          <span className="job__when">{entry.period}</span>
          <h2 className="ttl">{entry.degree}</h2>
          <p className="job__where">{entry.school}</p>
          {entry.note && (
            <p
              className="muted"
              style={{ marginTop: 12 }}
              dangerouslySetInnerHTML={{ __html: entry.note }}
            />
          )}
        </article>
      ))}

      <div className="row2">
        <article className="card">
          <h2 className="ttl">{data.courseworkTitle}</h2>
          <ul className="ul">
            {(data.coursework || []).map((cw) => (
              <li
                key={cw.id}
                dangerouslySetInnerHTML={{ __html: cw.text }}
              />
            ))}
          </ul>
        </article>

        <article className="card card--tint">
          <h2 className="ttl">{data.unlockedTitle}</h2>
          <div className="tags">
            {(data.unlocked || []).map((u) => (
              <span key={u.id} className="tag">
                {u.label}
              </span>
            ))}
          </div>
        </article>
      </div>

      <article className="card card--ink">
        <h2 className="ttl">{data.noteTitle}</h2>
        <p
          className="lede muted"
          style={{ marginTop: 10 }}
          dangerouslySetInnerHTML={{ __html: data.noteText }}
        />
      </article>
    </div>
  );
}
