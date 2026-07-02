import { useRef, useState } from 'react'
import { AlertCircle, CheckCircle2, Loader2, Send } from 'lucide-react'
import { FORM_ENDPOINT, services } from '@/data/site'
import { cn } from '@/lib/utils'

type Values = {
  name: string
  company: string
  email: string
  phone: string
  requirement: string
  message: string
}
type Errors = Partial<Record<keyof Values, string>>
type Status = 'idle' | 'submitting' | 'success' | 'error'

const EMPTY: Values = { name: '', company: '', email: '', phone: '', requirement: '', message: '' }
const requirements = [...services.map((s) => s.title), 'Other']

function validate(v: Values): Errors {
  const e: Errors = {}
  if (!v.name.trim()) e.name = 'Please enter your name.'
  if (!v.email.trim()) e.email = 'Please enter your email.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = 'Enter a valid email address.'
  if (!v.message.trim()) e.message = 'Tell us a little about the job.'
  return e
}

export function ContactForm() {
  const [values, setValues] = useState<Values>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>('idle')
  const formRef = useRef<HTMLFormElement>(null)

  const update = (key: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValues((v) => ({ ...v, [key]: e.target.value }))
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const found = validate(values)
    if (Object.keys(found).length) {
      setErrors(found)
      const first = formRef.current?.querySelector<HTMLElement>(`[name="${Object.keys(found)[0]}"]`)
      first?.focus()
      return
    }

    setStatus('submitting')
    try {
      if (FORM_ENDPOINT) {
        const res = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(values),
        })
        if (!res.ok) throw new Error('Request failed')
      } else {
        // Demo mode — no endpoint configured yet.
        await new Promise((r) => setTimeout(r, 900))
      }
      setStatus('success')
      setValues(EMPTY)
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div
        className="steel-panel flex flex-col items-center rounded-2xl border border-line p-10 text-center"
        role="status"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-arc/30 bg-arc/10">
          <CheckCircle2 className="h-7 w-7 text-arc" />
        </span>
        <h3 className="mt-5 text-xl font-semibold text-fg">Thanks — we’ve got it.</h3>
        <p className="mt-2 max-w-sm text-sm text-muted">
          We’ll review your requirement and get back to you shortly. For anything urgent, call us
          directly and we’ll pick it up right away.
        </p>
        {!FORM_ENDPOINT && (
          <p className="mt-5 font-mono text-[0.68rem] text-faint">
            Demo mode — set FORM_ENDPOINT in src/data/site.ts to receive submissions.
          </p>
        )}
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-6 text-sm font-medium text-arc hover:text-arc-bright"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="rounded-2xl border border-line bg-panel p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" required error={errors.name}>
          <input
            id="name"
            name="name"
            value={values.name}
            onChange={update('name')}
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
            className={inputCls(!!errors.name)}
            placeholder="Your full name"
          />
        </Field>

        <Field label="Company" name="company">
          <input
            id="company"
            name="company"
            value={values.company}
            onChange={update('company')}
            autoComplete="organization"
            className={inputCls(false)}
            placeholder="Company name"
          />
        </Field>

        <Field label="Email" name="email" required error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            value={values.email}
            onChange={update('email')}
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className={inputCls(!!errors.email)}
            placeholder="you@company.com"
          />
        </Field>

        <Field label="Phone" name="phone">
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            value={values.phone}
            onChange={update('phone')}
            autoComplete="tel"
            className={inputCls(false)}
            placeholder="+91 …"
          />
        </Field>
      </div>

      <div className="mt-5">
        <Field label="Requirement" name="requirement">
          <select
            id="requirement"
            name="requirement"
            value={values.requirement}
            onChange={update('requirement')}
            className={inputCls(false)}
          >
            <option value="">Select a category…</option>
            {requirements.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-5">
        <Field label="Message" name="message" required error={errors.message}>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={values.message}
            onChange={update('message')}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? 'message-error' : undefined}
            className={cn(inputCls(!!errors.message), 'h-auto resize-y py-3')}
            placeholder="Describe the part or tooling, quantities, and any drawings you can share."
          />
        </Field>
      </div>

      {status === 'error' && (
        <div
          role="alert"
          className="mt-5 flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-fg"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <span>Something went wrong sending your message. Please try again, or email us directly.</span>
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="mt-7 inline-flex h-14 w-full items-center justify-center gap-2 rounded-md bg-ember px-6 font-medium text-ink transition-[background-color,box-shadow] duration-200 hover:bg-ember-bright hover:shadow-glow-ember disabled:opacity-60"
      >
        {status === 'submitting' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending…
          </>
        ) : (
          <>
            Send message <Send className="h-4 w-4" />
          </>
        )}
      </button>
      <p className="mt-3 text-center text-xs text-faint">
        We’ll only use your details to respond to this enquiry.
      </p>
    </form>
  )
}

function inputCls(invalid: boolean) {
  return cn(
    'h-12 w-full rounded-lg border bg-ink px-4 text-sm text-fg placeholder:text-faint',
    'transition-colors focus:outline-none focus:ring-1',
    invalid
      ? 'border-destructive focus:border-destructive focus:ring-destructive'
      : 'border-line focus:border-arc focus:ring-arc',
  )
}

function Field({
  label,
  name,
  required,
  error,
  children,
}: {
  label: string
  name: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-fg">
        {label}
        {required && <span className="ml-1 text-ember-bright">*</span>}
      </label>
      {children}
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
