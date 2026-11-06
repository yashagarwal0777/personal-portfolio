import React, { useState } from 'react';

export default function ContactSection({ data, onToast }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!data) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, message } = formData;

    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus({ text: 'Please fill in every field.', type: 'bad' });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setStatus({ text: "That email address doesn't look right.", type: 'bad' });
      return;
    }

    setIsSubmitting(true);
    setStatus({ text: 'Sending your message…', type: 'busy' });

    setTimeout(() => {
      setIsSubmitting(false);
      setStatus({
        text: `Sent — thanks! I'll reply to ${email} as soon as possible.`,
        type: 'good',
      });
      setFormData({ name: '', email: '', message: '' });
      if (onToast) onToast('Message sent successfully!');

      const recipientEmail = data.email || 'Yash.Agrawal0220@gmail.com';
      const mailtoUrl = `mailto:${recipientEmail}?subject=${encodeURIComponent(
        `Portfolio enquiry from ${name}`
      )}&body=${encodeURIComponent(`${message}\n\n—\n${name}\n${email}`)}`;

      // Open mailto smoothly
      const a = document.createElement('a');
      a.href = mailtoUrl;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }, 900);
  };

  const whatsappNumber = data.whatsapp || '917849875575';
  const whatsappUrl =
    `https://wa.me/${whatsappNumber}?text=` +
    encodeURIComponent('Hi Yash — I found your portfolio and wanted to get in touch.');

  return (
    <div className="pbody">
      <article className="card card--tint">
        <p className="lede" dangerouslySetInnerHTML={{ __html: data.lede }} />
      </article>

      <div className="row2">
        {(data.links || []).map((link) => {
          const isExternal =
            /^https?:/i.test(link.href) || /\.pdf$/i.test(link.href);
          return (
            <a
              key={link.id}
              className="cbtn"
              href={link.href}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
            >
              <span className="cbtn__ico" aria-hidden="true">
                {link.icon}
              </span>
              <span className="cbtn__k">{link.key}</span>
              <span className="cbtn__v">{link.value}</span>
              <span className="cbtn__go" aria-hidden="true">
                →
              </span>
            </a>
          );
        })}
      </div>

      <article className="card">
        <span className="eyebrow">Send a message</span>
        <h2 className="ttl">Drop me a line</h2>

        <form className="form" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="cName">Your name</label>
            <input
              id="cName"
              name="name"
              type="text"
              required
              placeholder="Who's writing?"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="cFrom">Your email</label>
            <input
              id="cFrom"
              name="email"
              type="email"
              required
              placeholder="you@company.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="f--full">
            <label htmlFor="cMsg">Message</label>
            <textarea
              id="cMsg"
              name="message"
              rows={4}
              required
              placeholder="Tell me about the role or project…"
              value={formData.message}
              onChange={handleChange}
            />
          </div>

          <div className="sendrow f--full">
            <button className="send" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'SENDING…' : 'SEND IT'}
            </button>
            <a
              className="wabtn"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span aria-hidden="true">✆</span> WhatsApp instead
            </a>
          </div>

          {status.text && (
            <p className={`formmsg f--full ${status.type}`} role="status">
              {status.text}
            </p>
          )}
        </form>
      </article>

      <div className="row2">
        <article className="card card--ink">
          <h2 className="ttl">{data.basedInTitle}</h2>
          <p
            className="lede muted"
            style={{ marginTop: 8 }}
            dangerouslySetInnerHTML={{ __html: data.basedInText }}
          />
        </article>

        <article className="card card--lift">
          <h2 className="ttl">{data.lookingTitle}</h2>
          <ul className="ul">
            {(data.looking || []).map((l) => (
              <li key={l.id} dangerouslySetInnerHTML={{ __html: l.text }} />
            ))}
          </ul>
        </article>
      </div>
    </div>
  );
}
