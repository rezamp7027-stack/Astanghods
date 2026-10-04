# Astanghods engineering rules

- Keep main deployable. Feature work goes to a topic branch and merges via PR.
- Keep UI, domain types, and Supabase access separated.
- Never expose service-role or secret keys to the client.
- Never use editable user metadata for authorization decisions.
- Every exposed Supabase table must have RLS with least-privilege policies.
- Treat youth and parent data as sensitive. Collect minimum required data.
- Prefer server components for data reads; use client components only for real interaction.
- Keep the public site fast on mobile and accessible in RTL.
- Never replace a production Supabase schema without inspecting it and creating a migration plan.
- Use Temporal for durable workflows, not ordinary page interactions.
- Auth0 is optional staff or enterprise SSO, not a second public-user identity system by default.
- Before merge: typecheck, lint, build, Fallow static analysis, security review.
