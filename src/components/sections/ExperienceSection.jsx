import React from 'react';

export default function ExperienceSection({ data }) {
  if (!data) return null;

  return (
    <div className="pbody">
      {(data.jobs || []).map((job) => (
        <article key={job.id} className="card card--lift">
          <span className="job__when">
            {job.period} {job.state ? `· ${job.state}` : ''}
          </span>
          <h2 className="ttl">{job.title}</h2>
          <p className="job__where">
            {job.company} {job.location ? `· ${job.location}` : ''}
          </p>
          <ul className="ul">
            {(job.bullets || []).map((b) => (
              <li
                key={b.id}
                dangerouslySetInnerHTML={{ __html: b.text }}
              />
            ))}
          </ul>
          {job.loot && (
            <p className="loot">
              <b>Picked up:</b> {job.loot}
            </p>
          )}
        </article>
      ))}

      <article className="card card--tint">
        <h2 className="ttl">{data.projectsTitle}</h2>
        <p className="muted" style={{ marginTop: 6 }}>
          {data.projectsNote}
        </p>
      </article>

      <div className="row2">
        {(data.projects || []).map((proj) => (
          <article key={proj.id} className="card card--lift">
            <span className="eyebrow">Rank {proj.rank}</span>
            <h3 className="ttl ttl--sm">{proj.title}</h3>
            <p
              className="muted"
              style={{ marginTop: 8 }}
              dangerouslySetInnerHTML={{ __html: proj.desc }}
            />
            <div className="tags">
              {(proj.tags || []).map((tag) => (
                <span key={tag.id} className="tag">
                  {tag.label}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
