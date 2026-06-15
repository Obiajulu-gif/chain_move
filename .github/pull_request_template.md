## Summary

What changed?

## Area changed

Check all that apply:

- [ ] Frontend / UI
- [ ] Backend / API routes
- [ ] Auth / Privy
- [ ] Payments / Paystack
- [ ] Email / Resend
- [ ] Stellar / Soroban
- [ ] MongoDB models
- [ ] Documentation
- [ ] Tests
- [ ] Security

## Contributor safety checklist

- [ ] I did not commit `.env.local` or real secrets.
- [ ] I did not expose server-only variables in client-side code.
- [ ] I used mock mode or my own sandbox/test credentials.
- [ ] I did not add deployment steps for contributor PRs.
- [ ] I did not add maintainer-only credentials.

## Testing

Commands run:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Screenshots / demo

Add screenshots or screen recordings for UI changes.

## Notes for maintainers

Mention anything that needs special review, migration, or follow-up.
