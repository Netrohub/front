# Deployment Checklist for Dashboard & @username Features

## ✅ Completed Implementation
- [x] Unified `/dashboard` with role-aware tabs
- [x] User profiles at `/@:username`
- [x] Legacy route redirects
- [x] `_redirects` file for SPA routing
- [x] React Query hooks refactored
- [x] Backend API endpoints ready

## 🚀 Deployment Steps

### Frontend (Cloudflare Pages)

1. **Trigger New Deployment**:
   ```bash
   # Option A: Via Cloudflare Dashboard
   # - Go to Pages → Your Project → Deployments
   # - Click "Retry deployment" or "Create new deployment"
   
   # Option B: Via Git (if connected)
   git push origin master:front
   # Then Cloudflare auto-deploys
   ```

2. **Verify Build Output**:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Ensure `dist/_redirects` exists ✅

3. **Environment Variables**:
   ```
   VITE_API_BASE_URL=https://back-g6gc.onrender.com/api
   ```

4. **Test After Deployment**:
   - [ ] Visit `https://nxoland.com/dashboard` → should load Overview tab
   - [ ] Try `https://nxoland.com/@test` → should show user profile or 404
   - [ ] Check `https://nxoland.com/account/dashboard` → should redirect to `/dashboard?tab=buyer`
   - [ ] Check `https://nxoland.com/seller/dashboard` → should redirect to `/dashboard?tab=seller`

### Backend (Render)

Backend is already updated with:
- [x] Database schema fixed (ProductStatus enum, kyc_verifications.notes)
- [x] User profile API endpoints (`GET /api/users/:username`)
- [x] Case-insensitive username lookup
- [x] Reserved usernames system

**Backend should auto-restart after database fix** ✅

## 🐛 Troubleshooting

### If `/@username` Returns 404:
1. **Check `_redirects` file is deployed**:
   - View page source at `https://nxoland.com/_redirects`
   - Should show the redirects rules

2. **Clear Browser Cache**:
   ```
   Ctrl+Shift+R (hard refresh)
   Or open in Incognito mode
   ```

3. **Check Network Tab**:
   - Open DevTools → Network
   - Visit `/@username`
   - Should see: `GET /api/users/:username` request

### If Dashboard Shows Old UI:
1. **Clear Cloudflare Cache**:
   - Dashboard → Caching → Configuration
   - "Purge Everything"

2. **Check Build Hash**:
   - View page source
   - Look for `index-*.js` filename
   - Should match latest commit

### If Backend API Fails:
1. **Restart Backend Service**:
   - Go to Render Dashboard
   - Click "Manual Deploy" → "Clear build cache & deploy"

2. **Check Logs**:
   ```bash
   # Look for these success messages:
   ✅ ProductStatus enum created
   ✅ kyc_verifications.notes added
   ✅ User profile setup complete
   ```

3. **Test API Directly**:
   ```bash
   # Should return user data:
   curl https://back-g6gc.onrender.com/api/users/test
   
   # Should return 404 for non-existent user:
   curl https://back-g6gc.onrender.com/api/users/nonexistent
   ```

## 📊 Verification Commands

```bash
# Frontend build verification
cd nxoland-frontend
npm run build
ls -la dist/_redirects  # Should exist
cat dist/_redirects     # Should show redirects

# Backend verification
# (Run in database)
SELECT * FROM information_schema.columns 
WHERE table_name = 'kyc_verifications' AND column_name = 'notes';
-- Should return 1 row

SELECT typname FROM pg_type WHERE typname = 'ProductStatus';
-- Should return 'ProductStatus'
```

## 🎯 Final Checklist

- [ ] Frontend deployed to Cloudflare Pages
- [ ] Backend restarted on Render  
- [ ] Database schema updated
- [ ] Cloudflare cache cleared
- [ ] Browser cache cleared
- [ ] Tested `/dashboard` route
- [ ] Tested `/@username` route
- [ ] Tested legacy redirects
- [ ] Verified API endpoints work

## 📞 Support

If issues persist after following this checklist:
1. Check browser console for errors
2. Check network tab for failed requests
3. Review Render logs for backend errors
4. Verify database connection is healthy

