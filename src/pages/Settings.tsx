import { useState } from "react";
import {
  Settings as SettingsIcon,
  Plus,
  RotateCw,
  KeyRound,
  ShieldAlert,
  ShieldCheck,
  Save,
  Trash2,
  RefreshCw,
  Server,
  Coins,
  Activity,
  Workflow,
  Layers,
  Timer,
  Stethoscope,
  ChevronDown,
  Info,
  Lock,
  Smartphone,
  AlertTriangle,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { cn } from "@/lib/utils";

/* ---------- presentational helpers (UI only, no business logic) ---------- */

function Card({
  title,
  icon: Icon,
  right,
  children,
  className,
}: {
  title?: string;
  icon?: React.ComponentType<{ className?: string }>;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("pk-card", className)}>
      {title && (
        <header className="pk-card-header">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" />}
            <h3 className="pk-section-title">{title}</h3>
          </div>
          {right}
        </header>
      )}
      <div className="pk-card-body">{children}</div>
    </section>
  );
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block space-y-1">
      <span className="pk-label">{label}</span>
      {children}
      {hint && <span className="pk-helper block">{hint}</span>}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full h-8 rounded-md border border-input bg-background/60 px-2.5",
        "text-[12px] text-foreground placeholder:text-muted-foreground/70",
        "focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring",
        "pk-mono",
        props.className
      )}
    />
  );
}

function BtnPrimary({
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md bg-primary text-primary-foreground",
        "h-8 px-3 text-[11px] font-semibold hover:bg-primary/90 transition-colors",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        rest.className
      )}
    >
      {children}
    </button>
  );
}

function BtnGhost({
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...rest} className={cn("pk-btn-ghost h-8", rest.className)}>
      {children}
    </button>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-4 w-7 items-center rounded-full transition-colors",
        checked ? "bg-primary" : "bg-secondary"
      )}
    >
      <span
        className={cn(
          "inline-block h-3 w-3 transform rounded-full bg-card shadow transition-transform",
          checked ? "translate-x-3.5" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

function Segment<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="pk-segment" role="tablist">
      {options.map((o) => (
        <button
          key={o.value}
          data-active={value === o.value}
          onClick={() => onChange(o.value)}
          role="tab"
          aria-selected={value === o.value}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ----------------------------- page ----------------------------- */

const CURRENCIES = [
  "BNB", "BTC", "BUIDL", "ETH", "ETHW", "EURR",
  "MATIC", "PAXG", "SOL", "STETH", "USDC", "USDE",
  "USDT", "USYC", "XRP",
];

export default function Settings() {
  // UI-only state. All saves/removes are wired to stub handlers.
  const [tab, setTab] = useState<"api" | "security">("api");
  const [provider, setProvider] = useState("Deribit");
  const providers = ["Deribit"]; // saved providers shown as chips
  const [apiEnabled, setApiEnabled] = useState(true);
  const [env, setEnv] = useState<"live" | "test">("live");
  const [selectedCcy, setSelectedCcy] = useState<string[]>(["ETH"]);
  const [lookback, setLookback] = useState(365);
  const [watchAll, setWatchAll] = useState(true);
  const [autoSync, setAutoSync] = useState(false);
  const [interval, setInterval] = useState(15);
  const [tradeMatching, setTradeMatching] = useState(true);

  const toggleCcy = (c: string) =>
    setSelectedCcy((s) =>
      s.includes(c) ? s.filter((x) => x !== c) : [...s, c]
    );

  // Stub handlers (do not change real save/secret logic when wired)
  const noop = () => {};

  return (
    <AppShell>
      <div className="px-5 py-4 max-w-[1440px] mx-auto">
        {/* Header */}
        <header className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-2.5">
            <div className="h-7 w-7 rounded-md bg-secondary border border-border flex items-center justify-center mt-0.5">
              <SettingsIcon className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <div>
              <h1 className="text-[18px] font-semibold leading-tight tracking-tight">
                Settings
              </h1>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Manage API access, local secrets, sync behavior, and diagnostics.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 justify-end">
            <span className="pk-chip pk-chip-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-soft" />
              API enabled
            </span>
            <span className="pk-chip pk-chip-warn">
              <ShieldAlert className="h-3 w-3" />
              Local unlock required
            </span>
            <span className="pk-chip pk-chip-info">
              <Activity className="h-3 w-3" />
              Sync ready
            </span>
            <span className="pk-chip pk-chip-success">
              <ShieldCheck className="h-3 w-3" />
              MFA aal2
            </span>
          </div>
        </header>

        {/* Settings tabs (API / Security) */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <div className="pk-segment" role="tablist">
            <button
              role="tab"
              aria-selected={tab === "api"}
              data-active={tab === "api"}
              onClick={() => setTab("api")}
              className="inline-flex items-center gap-1.5"
            >
              <Workflow className="h-3 w-3" />
              API
            </button>
            <button
              role="tab"
              aria-selected={tab === "security"}
              data-active={tab === "security"}
              onClick={() => setTab("security")}
              className="inline-flex items-center gap-1.5"
            >
              <ShieldCheck className="h-3 w-3" />
              Security
            </button>
          </div>

          {tab === "api" && (
            <div className="ml-auto flex items-center gap-2">
              <span className="pk-label">API status</span>
              <Toggle checked={apiEnabled} onChange={setApiEnabled} label="API status" />
            </div>
          )}
        </div>

        {/* Provider chip strip — visible only on API tab */}
        {tab === "api" && (
          <div className="flex flex-wrap items-center gap-1.5 mb-3 rounded-md border border-border bg-card/60 px-2 py-1.5">
            {providers.map((p) => (
              <button
                key={p}
                data-active={provider === p}
                onClick={() => setProvider(p)}
                className="pk-pill"
              >
                {p}
              </button>
            ))}
            <button
              onClick={noop}
              className="pk-pill border-dashed text-muted-foreground"
              aria-label="Add provider"
            >
              <Plus className="h-3 w-3" />
              Add
            </button>
            <span className="pk-helper hidden md:inline ml-2">
              Each profile stores its own keys, secrets, scope and writes trades to its own table lane.
            </span>
          </div>
        )}

        {/* Main grid */}
        <div className="grid grid-cols-12 gap-3">
          {/* LEFT (8 cols) */}
          <div className="col-span-12 lg:col-span-8 space-y-3">
            {/* Credentials */}
            <Card
              title="Credentials"
              icon={KeyRound}
              right={
                <div className="flex items-center gap-1.5">
                  <span className="pk-chip pk-chip-success">Saved locally</span>
                  <span className="pk-chip">Updated 14m ago</span>
                </div>
              }
            >
              {/* slim local-unlock alert */}
              <div className="pk-alert pk-alert-warn mb-3">
                <ShieldAlert className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-semibold">Local unlock required.</span>{" "}
                  Unlock your local secret vault before PropKit can manage exchange and proxy credentials.
                </div>
                <button
                  onClick={noop}
                  className="text-[11px] font-semibold underline-offset-2 hover:underline whitespace-nowrap"
                >
                  Open security settings
                </button>
              </div>

              <p className="pk-helper mb-2">
                Plaintext API key and secret are no longer re-displayed after save. Enter new values
                only when you want to update them.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label="API key">
                  <Input
                    type="password"
                    autoComplete="off"
                    placeholder="Stored locally — enter a new key to replace it"
                  />
                </Field>
                <Field label="API secret">
                  <Input
                    type="password"
                    autoComplete="off"
                    placeholder="Stored locally — enter a new secret to replace it"
                  />
                </Field>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 mt-3">
                <BtnPrimary onClick={noop}>
                  <Save className="h-3.5 w-3.5" />
                  Save credentials
                </BtnPrimary>
                <BtnGhost onClick={noop}>
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove saved
                </BtnGhost>
              </div>
            </Card>

            {/* Currencies + Lookback + Environment */}
            <Card
              title="Markets & environment"
              icon={Coins}
              right={
                <BtnGhost onClick={noop}>
                  <RotateCw className="h-3 w-3" />
                  Refresh from API
                </BtnGhost>
              }
            >
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="pk-label">Currencies</span>
                    <span className="text-[10px] text-muted-foreground">
                      {selectedCcy.length} selected
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {CURRENCIES.map((c) => (
                      <button
                        key={c}
                        data-active={selectedCcy.includes(c)}
                        onClick={() => toggleCcy(c)}
                        className="pk-pill"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Lookback (days)">
                    <Input
                      type="number"
                      min={1}
                      value={lookback}
                      onChange={(e) => setLookback(Number(e.target.value))}
                    />
                  </Field>
                  <div>
                    <span className="pk-label block mb-1">Environment</span>
                    <Segment<"live" | "test">
                      value={env}
                      onChange={setEnv}
                      options={[
                        { value: "live", label: "Live" },
                        { value: "test", label: "Test" },
                      ]}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Subaccount sync */}
            <Card
              title="Subaccount sync"
              icon={Layers}
              right={
                <div className="flex items-center gap-1.5">
                  <span className="pk-label">Watch all</span>
                  <Toggle checked={watchAll} onChange={setWatchAll} label="Watch all" />
                </div>
              }
            >
              <p className="pk-helper mb-2">
                Pulls main account and all accessible subaccounts that the current API key allows.
              </p>
              <div className="pk-alert pk-alert-success">
                <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                <div>
                  Sync may be skipped when the API key lacks permissions or when the exchange
                  response does not include subaccounts. Diagnostics will show this per route.
                </div>
              </div>
            </Card>

            {/* Trade matching */}
            <Card
              title="Trade matching"
              icon={Workflow}
              right={
                <div className="flex items-center gap-1.5">
                  <span className="pk-chip pk-chip-info">Live</span>
                  <span className="pk-chip">Default</span>
                  <Toggle
                    checked={tradeMatching}
                    onChange={setTradeMatching}
                    label="Trade matching"
                  />
                </div>
              }
            >
              <div className="grid grid-cols-3 gap-2 mb-2 text-[11px]">
                <div className="rounded-md border border-border bg-secondary/40 px-2.5 py-1.5">
                  <div className="pk-label">Open</div>
                  <div className="pk-mono mt-0.5">2 m</div>
                </div>
                <div className="rounded-md border border-border bg-secondary/40 px-2.5 py-1.5">
                  <div className="pk-label">Live</div>
                  <div className="pk-mono mt-0.5">2 m</div>
                </div>
                <div className="rounded-md border border-border bg-secondary/40 px-2.5 py-1.5">
                  <div className="pk-label">Ask close</div>
                  <div className="pk-mono mt-0.5">On</div>
                </div>
              </div>
              <div className="rounded-md border border-dashed border-border py-4 text-center">
                <div className="pk-helper">No matching rules defined</div>
              </div>
            </Card>
          </div>

          {/* RIGHT (4 cols) */}
          <div className="col-span-12 lg:col-span-4 space-y-3">
            {/* Security — moved out of the right-side sheet into its own settings block */}
            <Card
              title="Security"
              icon={ShieldCheck}
              right={
                <div className="flex items-center gap-1.5">
                  <span className="pk-chip pk-chip-success">aal2</span>
                  <span className="pk-chip pk-chip-warn">Local unlock</span>
                </div>
              }
            >
              <p className="pk-helper mb-3">
                Manage MFA factors, the local unlock code, and the protected secret layer for
                this device. Sensitive actions still require AAL2.
              </p>

              {/* MFA row */}
              <div className="rounded-md border border-border bg-secondary/30 p-2.5 mb-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <Smartphone className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-[12px] font-semibold">MFA (TOTP)</span>
                  </div>
                  <span className="pk-chip pk-chip-success">1 verified</span>
                </div>
                <div className="pk-helper mb-2">
                  Authenticator-app factor enrolled. Required for credential edits.
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <BtnGhost onClick={noop}>
                    <Plus className="h-3.5 w-3.5" />
                    Enroll factor
                  </BtnGhost>
                  <BtnGhost onClick={noop}>
                    <RefreshCw className="h-3.5 w-3.5" />
                    Refresh MFA state
                  </BtnGhost>
                </div>
              </div>

              {/* Local unlock row */}
              <div className="rounded-md border border-border bg-secondary/30 p-2.5 mb-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-[12px] font-semibold">Local unlock code</span>
                  </div>
                  <span className="pk-chip pk-chip-warn">Not configured</span>
                </div>
                <div className="pk-helper mb-2">
                  Protects locally stored exchange &amp; proxy secrets. Min 10 chars, 1 letter, 1 digit.
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <Input type="password" autoComplete="new-password" placeholder="New code" />
                  <Input type="password" autoComplete="new-password" placeholder="Confirm" />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <BtnPrimary onClick={noop}>
                    <Lock className="h-3.5 w-3.5" />
                    Set unlock code
                  </BtnPrimary>
                  <BtnGhost onClick={noop}>
                    <RefreshCw className="h-3.5 w-3.5" />
                    Refresh state
                  </BtnGhost>
                </div>
              </div>

              {/* Reset protected secret layer */}
              <div className="rounded-md border border-[hsl(var(--destructive)/0.3)] bg-[hsl(var(--destructive)/0.05)] p-2.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                  <span className="text-[12px] font-semibold text-destructive">
                    Reset protected secret layer
                  </span>
                </div>
                <div className="pk-helper mb-2">
                  Clears stored exchange &amp; proxy credentials for this device only. Auth, MFA, and
                  business data remain intact. Unrecoverable.
                </div>
                <BtnGhost
                  onClick={noop}
                  className="border-[hsl(var(--destructive)/0.4)] text-destructive hover:bg-[hsl(var(--destructive)/0.1)] hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Reset secret layer
                </BtnGhost>
              </div>
            </Card>

            <Card
              title="Proxy configuration"
              icon={Server}
              right={<span className="pk-chip">Not stored yet</span>}
            >
              <p className="pk-helper mb-2.5">
                Host, port, login and password are handled inside the secret boundary. Saved
                values are not re-displayed.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Field label="IP / Host">
                  <Input placeholder="127.0.0.1" />
                </Field>
                <Field label="Port">
                  <Input placeholder="8888" />
                </Field>
                <Field label="Login">
                  <Input placeholder="Proxy login" />
                </Field>
                <Field label="Password">
                  <Input type="password" placeholder="Stored locally" autoComplete="off" />
                </Field>
              </div>
              <div className="flex items-center gap-1.5 mt-3">
                <BtnPrimary onClick={noop}>
                  <Save className="h-3.5 w-3.5" />
                  Save proxy
                </BtnPrimary>
                <BtnGhost onClick={noop}>
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </BtnGhost>
              </div>
            </Card>

            {/* Auto-sync */}
            <Card
              title="Auto-sync"
              icon={Timer}
              right={
                <div className="flex items-center gap-1.5">
                  <span className="pk-label">{autoSync ? "Auto" : "Manual only"}</span>
                  <Toggle checked={autoSync} onChange={setAutoSync} label="Auto-sync" />
                </div>
              }
            >
              <Field label="Interval (minutes)">
                <Input
                  type="number"
                  min={1}
                  value={interval}
                  onChange={(e) => setInterval(Number(e.target.value))}
                  disabled={!autoSync}
                />
              </Field>
              <div className="pk-helper mt-2 flex items-center gap-1.5">
                <ShieldCheck className="h-3 w-3 text-warning" />
                Local-only storage. Schedule is not synced to the cloud.
              </div>
            </Card>

            {/* Sync state */}
            <Card
              title="Sync state"
              icon={Activity}
              right={<span className="pk-chip pk-chip-success">Ready</span>}
            >
              <div className="divide-y divide-border/60">
                <div className="pk-kv">
                  <span>Last refresh</span>
                  <span>13:18:04</span>
                </div>
                <div className="pk-kv">
                  <span>Rows applied</span>
                  <span>+0</span>
                </div>
                <div className="pk-kv">
                  <span>Table lane</span>
                  <span>deribit-api-live.csv</span>
                </div>
                <div className="pk-kv">
                  <span>Profile</span>
                  <span>DERIBIT</span>
                </div>
                <div className="pk-kv">
                  <span>Scope</span>
                  <span>All subaccounts</span>
                </div>
              </div>
            </Card>

            {/* Diagnostics */}
            <Card
              title="Sync diagnostics"
              icon={Stethoscope}
              right={<span className="pk-chip">4 routes</span>}
            >
              <ul className="text-[11px] divide-y divide-border/60">
                {[
                  { route: "SEQEQ", asset: "ETH", status: "ok", note: "Rows came from transaction_log", time: "12m ago" },
                  { route: "NICKKKKK", asset: "ETH", status: "idle", note: "No rows returned by transaction_log", time: "12m ago" },
                  { route: "FTMMMM", asset: "ETH", status: "idle", note: "No rows returned for this account/window", time: "12m ago" },
                  { route: "SEQEQ_S", asset: "ETH", status: "idle", note: "No rows returned for this account/window", time: "12m ago" },
                ].map((r) => (
                  <li key={r.route} className="flex items-center gap-2 py-1.5">
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full shrink-0",
                        r.status === "ok" ? "bg-success" : "bg-muted-foreground/50"
                      )}
                    />
                    <span className="pk-mono font-semibold w-20 truncate">{r.route}</span>
                    <span className="pk-chip">{r.asset}</span>
                    <span className="text-muted-foreground truncate flex-1">{r.note}</span>
                    <span className="text-[10px] text-muted-foreground/80 whitespace-nowrap">{r.time}</span>
                    <span
                      className={cn(
                        "pk-chip",
                        r.status === "ok" ? "pk-chip-success" : ""
                      )}
                    >
                      {r.status}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
