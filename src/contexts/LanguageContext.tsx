import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "ar";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    home: "Home",
    products: "Products",
    members: "Members",
    leaderboard: "Leaderboard",
    becomeASeller: "Become a Seller",
    login: "Login",
    register: "Register",
    about: "About",
    help: "Help Center",

    // Hero
    welcomeMessage: "Welcome to Nexo Platform",
    heroTitle: "Your Digital Gaming Marketplace",
    heroDescription:
      "Buy and sell game accounts, social media profiles, and digital products in a secure, trusted marketplace powered by cutting-edge technology.",
    exploreProducts: "Explore Products",

    // Common
    addToCart: "Add to Cart",
    price: "Price",
    category: "Category",
    rating: "Rating",
    search: "Search",
    filter: "Filter",
    filters: "Filters",
    sortBy: "Sort By",
    allCategories: "All Categories",
    loadMore: "Load More",
    submit: "Submit",
    cancel: "Cancel",
    save: "Save",
    edit: "Edit",
    delete: "Delete",
    back: "Back",
    next: "Next",
    previous: "Previous",
    required: "Required",
    optional: "Optional",

    // KYC Verification
    kyc: {
      verification: "Identity Verification",
      verificationStatus: "Verification Status",
      verificationOverview: "Verification Overview",
      verificationOverviewDescription: "To start selling on our platform, you must complete the identity verification process to ensure security and trust",
      verificationSteps: "Verification Steps",
      verificationRequired: "Verification Required",
      verificationRequiredDescription: "Identity verification must be completed to access seller dashboard",
      verificationIncomplete: "Verification Incomplete",
      fullyVerified: "Fully Verified",
      verificationRejected: "Verification Rejected",
      underReview: "Under Review",
      sellerAccessRestricted: "Seller Access Restricted",
      sellerAccessRestrictedDescription: "Identity verification must be completed to access seller features",
      requiredSteps: "Required Steps",
      completeVerification: "Complete Verification",
      backToAccount: "Back to Account",
      verificationBenefits: "Verification Benefits",
      benefit1: "Access to seller dashboard",
      benefit2: "Ability to list products",
      benefit3: "Secure payment processing",
      benefit4: "Buyer and seller protection",
      startVerification: "Start Verification",
      resubmitDocuments: "Resubmit Documents",
      goToSellerDashboard: "Go to Seller Dashboard",
      complete: "Complete",
      back: "Back",
      continue: "Continue",
      overview: "Overview",
      
      // Email Verification
      emailVerification: "Email Verification",
      emailDescription: "Verify your email address with a confirmation link",
      
      // Identity Verification
      identityVerification: "Identity Verification",
      identityDescription: "Verify your identity with government-issued ID",
      firstName: "First Name",
      lastName: "Last Name",
      dateOfBirth: "Date of Birth",
      nationality: "Nationality",
      idNumber: "ID Number",
      
      // Address Verification
      addressVerification: "Address Verification",
      addressDescription: "Confirm your current residential address",
      streetAddress: "Street Address",
      city: "City",
      state: "State/Province",
      postalCode: "Postal Code",
      country: "Country",
      
      // Phone Verification
      phoneVerification: "Phone Verification",
      phoneDescription: "Confirm your phone number for communication",
      phoneNumber: "Phone Number",
      phoneVerificationNote: "Verification Note",
      phoneVerificationNoteDescription: "A verification code will be sent to your phone number",
      sendVerificationCode: "Send Verification Code",
      
      // Document Upload
      documentUpload: "Document Upload",
      documentDescription: "Upload required documents for verification",
      idFront: "ID Front",
      idFrontDescription: "Clear photo of the front of your ID card",
      idBack: "ID Back",
      idBackDescription: "Clear photo of the back of your ID card",
      selfie: "Selfie",
      selfieDescription: "Clear selfie photo with your ID card",
      proofOfAddress: "Proof of Address",
      proofOfAddressDescription: "Bill or statement proving your address",
      
      // Bank Account Verification
      bankAccountVerification: "Bank Account Verification",
      bankAccountDescription: "Confirm your bank account information for payments",
      accountHolderName: "Account Holder Name",
      bankName: "Bank Name",
      accountNumber: "Account Number",
      routingNumber: "Routing Number",
      accountType: "Account Type",
      bankAccountSecurity: "Bank Account Security",
      bankAccountSecurityDescription: "Your banking information is protected with the highest security standards",
    },

    // Products
    allProducts: "All Products",
    browseProducts: "Browse thousands of verified digital products and accounts",
    searchPlaceholder: "Search for products, accounts, or services...",
    showing: "Showing",
    of: "of",
    productsText: "products",
    noProductsFound: "No products found matching your filters.",
    featured: "Featured",
    priceLowToHigh: "Price: Low to High",
    priceHighToLow: "Price: High to Low",
    highestRated: "Highest Rated",
    newestFirst: "Newest First",

    // Price Ranges
    allPrices: "All Prices",
    under100: "Under $100",
    range100to300: "$100 - $300",
    range300to500: "$300 - $500",
    over500: "Over $500",

    // Categories
    socialMedia: "Social Media",
    gaming: "Gaming",
    digitalServices: "Digital Services",
    software: "Software",
    entertainment: "Entertainment",

    // Games Page
    gamingMarketplace: "Gaming Marketplace",
    gameAccounts: "Game Accounts",
    gameAccountsDesc: "Buy premium game accounts across all major platforms. Secure, verified, and ready to play.",
    searchGames: "Search for game accounts, platforms, or titles...",
    activeListings: "Active Listings",
    successRate: "Success Rate",
    support247: "24/7 Support",
    browseByPlatform: "Browse by Platform",
    choosePlatform: "Choose your gaming platform",
    featuredAccounts: "Featured Accounts",
    premiumVerified: "Premium verified accounts",
    viewAll: "View All",
    verifiedAccounts: "Verified Accounts",
    verifiedAccountsDesc: "All accounts are verified and checked before listing",
    instantAccess: "Instant Access",
    instantAccessDesc: "Get your account details immediately after purchase",
    moneyBack: "Money Back",
    moneyBackDesc: "7-day money back guarantee on all purchases",
    accounts: "accounts",

    // Seller
    listProduct: "List Product",
    sellOn: "Sell on Nexo",
    sellerDashboard: "Seller Dashboard",
    startSellingOn: "Start Selling on",
    chooseWhatToSell: "What would you like to sell?",
    sellerOnboardingDesc:
      "Choose what you want to sell and get started in minutes. No upfront costs, just list and earn.",
    trustedBy: "Trusted by 10,000+ Sellers",
    quickSetup: "Quick Setup",
    securePayments: "Secure Payments",
    lowFees: "Low Fees",
    socialMediaAccounts: "Social Media Accounts",
    gamingAccounts: "Gaming Accounts",
    sellSocialDesc: "Sell Instagram, TikTok, YouTube, Twitter, and other social media accounts",
    sellGamingDesc: "Sell Steam, PlayStation, Xbox, Epic Games, and other gaming accounts",
    listSocialAccount: "List Social Account",
    listGamingAccount: "List Gaming Account",
    whySellOnNexo: "Why Sell on Nexo?",
    fastPayouts: "Fast Payouts",
    fastPayoutsDesc: "Get paid quickly with multiple withdrawal options",
    buyerProtection: "Buyer Protection",
    buyerProtectionDesc: "Secure transactions with built-in dispute resolution",
    largeAudience: "Large Audience",
    largeAudienceDesc: "Reach thousands of active buyers daily",

    // Seller Forms
    accountInformation: "Account Information",
    title: "Title",
    username: "Username",
    platform: "Platform",
    game: "Game",
    accountDescription: "Account Description",
    selectPlatform: "Select platform",
    selectGame: "Select game",
    configurationSetup: "Configuration Setup",
    setupInstructions: "Setup Instructions",
    phoneNumber: "Phone Number",
    ifApplicable: "If Applicable",
    sellerType: "Seller Type",
    individual: "Individual",
    business: "Business",
    verifiedSeller: "Verified Seller",
    pricingInformation: "Pricing Information",
    discountPrice: "Discount Price",
    discountDescription: "Discount Description",
    accountScreenshots: "Account Screenshots",
    uploadImage: "Upload Image",
    termsAndConditions: "Terms & Conditions",
    submitAccount: "Submit Account",
    accountListedSuccess: "Account Listed Successfully",
    accountSubmittedReview: "Your account has been submitted for review",
    termsRequired: "Terms Required",
    agreeToTerms: "Please agree to all terms and conditions",

    // Form Placeholders
    enterUsername: "Enter username only",
    provideDescription: "Provide detailed description of your account",
    enterInstructions: "Enter instructions (or accounting or banking details)",
    enterPhoneNumber: "Enter phone number (e.g., +1234567890)",
    enterPrice: "Enter your price",
    enterDiscountPrice: "Enter discount price (optional)",
    selectSellerType: "Select seller type",
    uploadScreenshots: "Upload screenshots or images of the account (max 6 images)",

    // Instructions
    socialDescriptionHelp:
      "If you want to submit additional details in one of the categories (Snapchat - TikTok - Pubg - Facebook), you must add the exact name of the category. Otherwise, please just describe it briefly, as well as clarify whether or not the account has 2FA. It is recommended to mention some of the account's problems if they exist.",
    configInstructionsHelp:
      "Briefly describe the product, whether it contains an email, phone number, or has a double (2FA)",
    pricingWarning:
      "If you want to create any external communication outside the platform in an attempt to scam, appeal, or scam, this will expose your account to theft",
    noExternalLinks:
      "Please do not include external links in the description field, as this may result in account suspension and possible exposure of your account to theft",
    setupInstructionsDesc: "Instructions to wait for buyer to buy and after buyer confirms purchase",
    specialOffer: "Special Offer",
    specialOfferDesc: "Get 10% free offers on top 100 users who confirm their bids and provide sales continuity",

    // Terms
    term1: "I pledge to only advertise available products and not to sell prohibited or inappropriate products",
    term2:
      "I fully assume legal liability for any lawsuit arising from the date of sale or breach of the legal buyer and seller agreement which guarantees the right to withdraw from the sale of electronic crimes",
    securityCommitment:
      "We are committed to providing a secure platform for buying and selling accounts. You must complete these steps to complete your account addition.",

    // Account
    myAccount: "My Account",
    dashboard: "Dashboard",
    profile: "Profile",
    orders: "Orders",
    wallet: "Wallet",
    notifications: "Notifications",
    billing: "Billing",
    logout: "Logout",

    // About Page
    aboutUs: "About Us",
    empoweringDigitalCommerce: "Empowering Digital Commerce",
    aboutDescription:
      "Nexo is the premier marketplace for digital gaming assets. We connect buyers and sellers in a secure, transparent environment where trust and quality come first.",
    activeUsers: "Active Users",
    productsSold: "Products Sold",
    countries: "Countries",
    ourStory: "Our Story",
    buildingFuture: "Building the future of digital marketplaces",
    storyParagraph1:
      "Founded in 2024, Nexo was born from a simple observation: the digital gaming marketplace was fragmented, insecure, and lacked the trust that modern commerce demands.",
    storyParagraph2:
      "We set out to change that. By combining cutting-edge technology, rigorous verification processes, and a customer-first approach, we created a platform where trading digital assets is as simple and secure as it should be.",
    storyParagraph3:
      "Today, Nexo is more than just a marketplace - it's a community. A place where gamers connect, trade grows, and digital commerce thrives in a safe, transparent environment.",
    ourValues: "Our Values",
    principlesGuide: "The principles that guide everything we do",
    securityFirst: "Security First",
    securityFirstDesc:
      "Your safety is our top priority. We use industry-leading security measures to protect every transaction.",
    lightningFast: "Lightning Fast",
    lightningFastDesc:
      "Instant delivery of digital products. No waiting, no delays - get what you paid for immediately.",
    qualityAssured: "Quality Assured",
    qualityAssuredDesc: "Every product and seller is verified. We maintain the highest standards in the marketplace.",
    communityDriven: "Community Driven",
    communityDrivenDesc:
      "Built by gamers, for gamers. We listen to our community and constantly improve based on your feedback.",
    ourMission: "Our Mission",
    missionStatement:
      "To create the world's most trusted digital marketplace where gamers can buy, sell, and trade with absolute confidence, knowing their transactions are secure, their assets are verified, and their community values integrity above all else.",

    // Pricing Page
    sellerPlans: "Seller Plans",
    startSellingToday: "Start Selling Today",
    choosePerfectPlan: "Choose the perfect plan for your business. Upgrade or downgrade anytime.",
    mostPopular: "MOST POPULAR",
    free: "Free",
    forever: "forever",
    perfectForGettingStarted: "Perfect for getting started",
    pro: "Pro",
    perMonth: "per month",
    forSeriousSellers: "For serious sellers",
    elite: "Elite",
    forTopTierSellers: "For top-tier sellers",
    getStarted: "Get Started",
    upgradeNow: "Upgrade Now",
    whatsIncluded: "What's included:",
    listUpTo3Products: "List up to 3 products",
    transactionFee5: "5% transaction fee",
    basicSellerProfile: "Basic seller profile",
    communitySupport: "Community support",
    standardVerification: "Standard verification",
    featuredListings: "Featured listings",
    prioritySupport: "Priority support",
    advancedAnalytics: "Advanced analytics",
    customBranding: "Custom branding",
    unlimitedProductListings: "Unlimited product listings",
    transactionFee3: "3% transaction fee",
    enhancedSellerProfile: "Enhanced seller profile",
    fastTrackVerification: "Fast-track verification",
    featuredListings5PerMonth: "Featured listings (5/month)",
    customProfileBanner: "Custom profile banner",
    dedicatedAccountManager: "Dedicated account manager",
    apiAccess: "API access",
    everythingInPro: "Everything in Pro",
    transactionFee1_5: "1.5% transaction fee",
    verifiedBadge: "Verified badge",
    unlimitedFeaturedListings: "Unlimited featured listings",
    earlyAccessToFeatures: "Early access to features",
    premiumSupport24_7: "Premium support (24/7)",
    promotedInLeaderboard: "Promoted in leaderboard",
    faqTitle: "Frequently Asked Questions",
    faqQuestion1: "Can I change plans anytime?",
    faqAnswer1: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.",
    faqQuestion2: "What payment methods do you accept?",
    faqAnswer2: "We accept all major credit cards, PayPal, and cryptocurrency payments.",
    faqQuestion3: "Is there a refund policy?",
    faqAnswer3: "Yes, we offer a 30-day money-back guarantee if you're not satisfied with your plan.",

    // Login Page
    welcomeBack: "Welcome Back",
    signInToAccount: "Sign in to your Nexo account",
    emailAddress: "Email Address",
    password: "Password",
    rememberMe: "Remember me",
    forgotPassword: "Forgot password?",
    cloudflareTurnstile: "🔒 Cloudflare Turnstile CAPTCHA",
    signIn: "Sign In",
    orContinueWith: "Or continue with",
    dontHaveAccount: "Don't have an account?",

    // Register Page
    joinNexoMarketplace: "Join Nexo marketplace today",
    chooseUsername: "Choose a username",
    createStrongPassword: "Create a strong password",
    passwordRequirements: "Must be at least 8 characters with numbers and symbols",
    confirmPassword: "Confirm Password",
    confirmYourPassword: "Confirm your password",
    iAgreeToThe: "I agree to the",
    and: "and",
    alreadyHaveAccount: "Already have an account?",

    // MobileNav
    wishlist: "Wishlist",

    // Cart Page
    shoppingCart: "Shopping Cart",
    itemsInCart: "items in your cart",
    quantity: "Quantity",
    remove: "Remove",
    enterCouponCode: "Enter coupon code",
    apply: "Apply",
    orderSummary: "Order Summary",
    subtotal: "Subtotal",
    serviceFee: "Service Fee",
    total: "Total",
    proceedToCheckout: "Proceed to Checkout",
    continueShopping: "Continue Shopping",
    secureCheckout: "Secure checkout",
    instantDelivery: "Instant delivery",
    moneyBackGuarantee: "Money-back guarantee",

    // Wishlist Page
    myWishlist: "My Wishlist",
    itemsSavedForLater: "items saved for later",
    addAllToCart: "Add All to Cart",
    clearWishlist: "Clear Wishlist",
    yourWishlistIsEmpty: "Your wishlist is empty",
    startAddingProducts: "Start adding products you love to keep track of them!",

    // Checkout Page
    checkout: "Checkout",
    completePurchaseSecurely: "Complete your purchase securely",
    contactInformation: "Contact Information",
    paymentMethod: "Payment Method",
    creditDebitCard: "Credit / Debit Card",
    payWithCard: "Pay with your card",
    walletBalance: "Wallet Balance",
    useYourWallet: "Use your wallet",
    cardNumber: "Card Number",
    expiryDate: "Expiry Date",
    cvc: "CVC",
    iAgreeToTerms: "I agree to the",
    refundPolicyLink: "Refund Policy",
    allSalesFinal: "and understand that all sales are final once the product is delivered",
    completePurchase: "Complete Purchase",
    secureEncryptedPayment: "Secure encrypted payment",
    sevenDayGuarantee: "7-day money back guarantee",

    // Help Center Page
    howCanWeHelp: "How Can We Help?",
    searchKnowledgeBase: "Search our knowledge base or browse categories below",
    searchHelpArticles: "Search for help articles, FAQs, or topics...",
    browseByCategory: "Browse by Category",
    articlesCount: "articles",
    gettingStarted: "Getting Started",
    ordersDelivery: "Orders & Delivery",
    paymentsRefunds: "Payments & Refunds",
    accountManagement: "Account Management",
    securityPrivacy: "Security & Privacy",
    sellerTools: "Seller Tools",
    frequentlyAskedQuestions: "Frequently Asked Questions",
    quickAnswers: "Quick answers to common questions",
    stillNeedHelp: "Still Need Help?",
    supportTeamAssist: "Our support team is here to assist you",
    liveChat: "Live Chat",
    liveChatDesc: "Chat with our support team in real-time",
    startChat: "Start Chat",
    emailSupport: "Email Support",
    emailSupportDesc: "Send us an email and we'll respond within 24 hours",
    sendEmail: "Send Email",

    // Footer
    marketplace: "Marketplace",
    allRightsReserved: "All rights reserved",
    company: "Company",
    support: "Support",
    legal: "Legal",
    termsOfService: "Terms of Service",
    privacyPolicy: "Privacy Policy",

    // Leaderboard
    topPerformers: "Top Performers",
    leaderboardDesc: "Discover the top sellers, most popular products, and active buyers in the Nexo community",
    topSellers: "Top Sellers",
    topProducts: "Top Products",
    topBuyers: "Top Buyers",
    sales: "sales",
    totalRevenue: "Total Revenue",
    sold: "sold",
    purchases: "purchases",
    totalSpent: "Total Spent",
    by: "by",
    refundPolicy: "Refund Policy",
    disputeCenter: "Dispute Center",
    verifiedSellers: "Verified Sellers",
    builtForGamers: "Built with 💜 for gamers",
    sellOnNexo: "Sell on Nexo",
    legalAndSupport: "Legal & Support",
  },
  ar: {
    // Navigation
    home: "الرئيسية 🏠",
    products: "المنتجات 📦",
    members: "الأعضاء 👥",
    leaderboard: "قائمة المتصدرين 🏆",
    becomeASeller: "كن بائعًا 💼",
    login: "تسجيل الدخول 🔐",
    register: "إنشاء حساب ✍️",
    about: "حول المنصة ℹ️",
    help: "مركز المساعدة ❓",

    // Hero
    welcomeMessage: "مرحبًا بك في منصة Nexo 🛍️",
    heroTitle: "سوقك الرقمي لعالم الألعاب 🎮",
    heroDescription:
      "اشترِ وبِع حسابات الألعاب، وحسابات التواصل الاجتماعي، والمنتجات الرقمية بكل أمان وموثوقية ضمن سوق يعتمد أحدث التقنيات 🔒⚙️",
    exploreProducts: "استكشف المنتجات 🔍",

    // Common
    addToCart: "أضف إلى السلة 🛒",
    price: "السعر 💰",
    category: "الفئة 📂",
    rating: "التقييم ⭐",
    search: "بحث 🔎",
    filter: "تصفية ⚙️",
    filters: "عوامل التصفية",
    sortBy: "ترتيب حسب",
    allCategories: "جميع الفئات",
    loadMore: "عرض المزيد ⬇️",
    submit: "إرسال ✅",
    cancel: "إلغاء ❌",
    save: "حفظ 💾",
    edit: "تعديل ✏️",
    delete: "حذف 🗑️",
    back: "رجوع ↩️",
    next: "التالي ▶️",
    previous: "السابق ◀️",
    required: "إلزامي ❗",
    optional: "اختياري",

    // KYC Verification
    kyc: {
      verification: "التحقق من الهوية",
      verificationStatus: "حالة التحقق",
      verificationOverview: "نظرة عامة على التحقق",
      verificationOverviewDescription: "لبدء البيع على منصتنا، يجب عليك إكمال عملية التحقق من الهوية لضمان الأمان والموثوقية",
      verificationSteps: "خطوات التحقق",
      verificationRequired: "التحقق مطلوب",
      verificationRequiredDescription: "يجب إكمال التحقق من الهوية للوصول إلى لوحة البائع",
      verificationIncomplete: "التحقق غير مكتمل",
      fullyVerified: "تم التحقق بالكامل",
      verificationRejected: "تم رفض التحقق",
      underReview: "قيد المراجعة",
      sellerAccessRestricted: "الوصول إلى البائع مقيد",
      sellerAccessRestrictedDescription: "يجب إكمال التحقق من الهوية للوصول إلى ميزات البائع",
      requiredSteps: "الخطوات المطلوبة",
      completeVerification: "إكمال التحقق",
      backToAccount: "العودة إلى الحساب",
      verificationBenefits: "فوائد التحقق",
      benefit1: "الوصول إلى لوحة البائع",
      benefit2: "إمكانية إدراج المنتجات",
      benefit3: "معالجة المدفوعات الآمنة",
      benefit4: "حماية المشتري والبائع",
      startVerification: "بدء التحقق",
      resubmitDocuments: "إعادة تقديم المستندات",
      goToSellerDashboard: "الذهاب إلى لوحة البائع",
      complete: "إكمال",
      back: "رجوع",
      continue: "متابعة",
      overview: "نظرة عامة",
      
      // Email Verification
      emailVerification: "التحقق من البريد الإلكتروني",
      emailDescription: "تحقق من عنوان بريدك الإلكتروني برابط التأكيد",
      
      // Identity Verification
      identityVerification: "التحقق من الهوية",
      identityDescription: "تحقق من هويتك باستخدام هوية حكومية صالحة",
      firstName: "الاسم الأول",
      lastName: "اسم العائلة",
      dateOfBirth: "تاريخ الميلاد",
      nationality: "الجنسية",
      idNumber: "رقم الهوية",
      
      // Address Verification
      addressVerification: "التحقق من العنوان",
      addressDescription: "تأكيد عنوان إقامتك الحالي",
      streetAddress: "عنوان الشارع",
      city: "المدينة",
      state: "الولاية/المحافظة",
      postalCode: "الرمز البريدي",
      country: "البلد",
      
      // Phone Verification
      phoneVerification: "التحقق من الهاتف",
      phoneDescription: "تأكيد رقم هاتفك للتواصل",
      phoneNumber: "رقم الهاتف",
      phoneVerificationNote: "ملاحظة التحقق",
      phoneVerificationNoteDescription: "سيتم إرسال رمز التحقق إلى رقم هاتفك",
      sendVerificationCode: "إرسال رمز التحقق",
      
      // Document Upload
      documentUpload: "رفع المستندات",
      documentDescription: "رفع المستندات المطلوبة للتحقق",
      idFront: "الوجه الأمامي للهوية",
      idFrontDescription: "صورة واضحة للوجه الأمامي لبطاقة الهوية",
      idBack: "الوجه الخلفي للهوية",
      idBackDescription: "صورة واضحة للوجه الخلفي لبطاقة الهوية",
      selfie: "صورة شخصية",
      selfieDescription: "صورة شخصية واضحة مع بطاقة الهوية",
      proofOfAddress: "إثبات العنوان",
      proofOfAddressDescription: "فاتورة أو كشف حساب يثبت العنوان",
      
      // Bank Account Verification
      bankAccountVerification: "التحقق من الحساب البنكي",
      bankAccountDescription: "تأكيد معلومات حسابك البنكي للمدفوعات",
      accountHolderName: "اسم صاحب الحساب",
      bankName: "اسم البنك",
      accountNumber: "رقم الحساب",
      routingNumber: "رقم التوجيه",
      accountType: "نوع الحساب",
      bankAccountSecurity: "أمان الحساب البنكي",
      bankAccountSecurityDescription: "معلوماتك البنكية محمية بأعلى معايير الأمان",
    },

    // Products
    allProducts: "جميع المنتجات 📦",
    browseProducts: "تصفح آلاف المنتجات الرقمية والحسابات الموثقة ✅",
    searchPlaceholder: "ابحث عن منتجات، حسابات، أو خدمات...",
    showing: "عرض",
    of: "من",
    productsText: "منتجات",
    noProductsFound: "لم يتم العثور على أي منتجات مطابقة لخيارات البحث 🔍",
    featured: "مميز ⭐",
    priceLowToHigh: "السعر: من الأرخص إلى الأعلى",
    priceHighToLow: "السعر: من الأعلى إلى الأرخص",
    highestRated: "الأعلى تقييمًا 🌟",
    newestFirst: "الأحدث أولًا 🆕",

    // Price Ranges
    allPrices: "جميع الأسعار 💰",
    under100: "أقل من 100 دولار",
    range100to300: "100 - 300 دولار",
    range300to500: "300 - 500 دولار",
    over500: "أكثر من 500 دولار 💸",

    // Categories
    socialMedia: "وسائل التواصل الاجتماعي 📱",
    gaming: "الألعاب 🎮",
    digitalServices: "الخدمات الرقمية 💻",
    software: "البرامج 🧰",
    entertainment: "الترفيه 🍿",

    // Games Page
    gamingMarketplace: "سوق الألعاب 🎮",
    gameAccounts: "حسابات الألعاب 🎮",
    gameAccountsDesc: "اشترِ حسابات ألعاب مميزة في جميع المنصات الكبرى ✅ آمنة، موثّقة، وجاهزة للعب مباشرة.",
    searchGames: "ابحث عن حسابات ألعاب، منصّات، أو عناوين...",
    activeListings: "العروض النشطة 📢",
    successRate: "نسبة النجاح 📈",
    support247: "دعم 24/7 🤝",
    browseByPlatform: "تصفح حسب المنصة 🖥️",
    choosePlatform: "اختر منصّة الألعاب الخاصة بك 🎮",
    featuredAccounts: "حسابات مميزة 🌟",
    premiumVerified: "حسابات مميزة وموثقة ✅",
    viewAll: "عرض الكل 👀",
    verifiedAccounts: "حسابات موثقة 🔐",
    verifiedAccountsDesc: "جميع الحسابات يتم التحقق منها وفحصها قبل نشرها 🛡️",
    instantAccess: "وصول فوري ⚡",
    instantAccessDesc: "احصل على تفاصيل حسابك فور إتمام عملية الشراء 📬",
    moneyBack: "ضمان استرجاع 💵",
    moneyBackDesc: "ضمان استرجاع الأموال خلال 7 أيام لجميع المشتريات 📆",
    accounts: "الحسابات",

    // Seller
    listProduct: "أضف منتجًا 📤",
    sellOn: "بع على Nexo 💼",
    sellerDashboard: "لوحة تحكم البائع 📊",
    startSellingOn: "ابدأ البيع على",
    chooseWhatToSell: "ما الذي تريد بيعه؟ 🤔",
    sellerOnboardingDesc: "اختر ما تريد بيعه وابدأ خلال دقائق ⏱️ لا توجد رسوم مسبقة – فقط أدرج واربح 💰",
    trustedBy: "موثوق من أكثر من 10,000 بائع 🤝",
    quickSetup: "إعداد سريع ⚙️",
    securePayments: "مدفوعات آمنة 🔐",
    lowFees: "رسوم منخفضة 💸",
    socialMediaAccounts: "حسابات التواصل الاجتماعي 📱",
    gamingAccounts: "حسابات الألعاب 🎮",
    sellSocialDesc: "بع حسابات Instagram و TikTok و YouTube و Twitter وغيرها 📲",
    sellGamingDesc: "بع حسابات Steam و PlayStation و Xbox و Epic Games وغيرها 🎮",
    listSocialAccount: "أضف حساب تواصل اجتماعي 📤",
    listGamingAccount: "أضف حساب ألعاب 🎮",
    whySellOnNexo: "لماذا تبيع على Nexo؟ 🤔",
    fastPayouts: "مدفوعات سريعة 💳",
    fastPayoutsDesc: "احصل على أموالك بسرعة مع خيارات سحب متعددة 💼",
    buyerProtection: "حماية المشتري 🛡️",
    buyerProtectionDesc: "معاملات آمنة مع نظام حل نزاعات مدمج ⚖️",
    largeAudience: "جمهور ضخم 🌍",
    largeAudienceDesc: "الوصول إلى آلاف المشترين النشطين يوميًا 📈",

    // Seller Forms
    accountInformation: "معلومات الحساب 📋",
    title: "العنوان 🏷️",
    username: "اسم المستخدم 👤",
    platform: "المنصّة 🖥️",
    game: "اللعبة 🎮",
    accountDescription: "وصف الحساب 📜",
    selectPlatform: "اختر المنصّة",
    selectGame: "اختر اللعبة",
    configurationSetup: "إعداد التكوين ⚙️",
    setupInstructions: "إرشادات الإعداد 📑",
    phoneNumber: "رقم الهاتف 📞",
    ifApplicable: "إذا كان ذلك مناسبًا",
    sellerType: "نوع البائع 🧑‍💼",
    individual: "فردي 👤",
    business: "شركة 🏢",
    verifiedSeller: "بائع موثّق ✅",
    pricingInformation: "معلومات التسعير 💰",
    discountPrice: "سعر الخصم 💵",
    discountDescription: "وصف الخصم ✏️",
    accountScreenshots: "صور الحساب 📸",
    uploadImage: "رفع صورة 📤",
    termsAndConditions: "الشروط والأحكام ⚖️",
    submitAccount: "إرسال الحساب 📤",
    accountListedSuccess: "تم إدراج الحساب بنجاح ✅",
    accountSubmittedReview: "تم إرسال حسابك للمراجعة 🕵️‍♂️",
    termsRequired: "الموافقة على الشروط إلزامية ⚠️",
    agreeToTerms: "يرجى الموافقة على جميع الشروط والأحكام ✔️",

    // Form Placeholders
    enterUsername: "أدخل اسم المستخدم فقط ✍️",
    provideDescription: "أضف وصفًا تفصيليًا لحسابك 📜",
    enterInstructions: "أدخل الإرشادات (أو تفاصيل الحساب أو البيانات البنكية) 📝",
    enterPhoneNumber: "أدخل رقم الهاتف (مثال: ‎+1234567890) 📞",
    enterPrice: "أدخل السعر 💰",
    enterDiscountPrice: "أدخل سعر الخصم (اختياري) 💵",
    selectSellerType: "اختر نوع البائع 👤",
    uploadScreenshots: "حمِّل صور الحساب (بحد أقصى 6 صور) 📸",

    // Instructions
    socialDescriptionHelp:
      "📱 إذا كنت تريد تقديم تفاصيل إضافية في إحدى الفئات (Snapchat - TikTok - Pubg - Facebook)، يجب عليك إضافة الاسم الدقيق للفئة. وإلا فاكتفِ بوصف مختصر، ووضّح ما إذا كان الحساب يحتوي على حماية ثنائية (2FA) أم لا. كما يُفضل ذكر أي مشاكل موجودة في الحساب إن وُجدت.",
    configInstructionsHelp: "🧾 صف المنتج بإيجاز، سواء كان يحتوي على بريد إلكتروني أو رقم هاتف أو حماية ثنائية (2FA).",
    pricingWarning:
      "⚠️ إذا حاولت إنشاء تواصل خارجي خارج المنصة بغرض الاحتيال أو التلاعب، سيتم تعريض حسابك للسرقة أو الحظر.",
    noExternalLinks: "🚫 يرجى عدم إضافة روابط خارجية في خانة الوصف، فقد يؤدي ذلك إلى إيقاف حسابك أو تعريضه للسرقة.",
    setupInstructionsDesc: "📦 تعليمات الانتظار حتى يقوم المشتري بالشراء، وبعدها يقوم بتأكيد عملية الشراء.",
    specialOffer: "عرض خاص 🎁",
    specialOfferDesc: "احصل على عرض مجاني بنسبة 10٪ لأفضل 100 مستخدم يؤكدون عروضهم ويستمرون في البيع 📈",

    // Terms
    term1: "📜 أتعهد بالإعلان فقط عن المنتجات المتوفرة وعدم بيع أي منتجات محظورة أو غير لائقة.",
    term2:
      "⚖️ أتحمّل كامل المسؤولية القانونية عن أي دعوى قضائية ناتجة عن تاريخ البيع أو خرق اتفاقية المشتري والبائع القانونية التي تضمن الحق في الانسحاب من البيع في حال الجرائم الإلكترونية.",
    securityCommitment:
      "🔐 نحن ملتزمون بتوفير منصة آمنة لشراء وبيع الحسابات. يجب عليك إكمال هذه الخطوات لإضافة حسابك بنجاح.",

    // Account
    myAccount: "حسابي 👤",
    dashboard: "لوحة التحكم 📊",
    profile: "الملف الشخصي 🪪",
    orders: "الطلبات 📦",
    wallet: "المحفظة 💳",
    notifications: "الإشعارات 🔔",
    billing: "الفواتير 🧾",
    logout: "تسجيل الخروج 🚪",

    // About Page
    aboutUs: "من نحن ℹ️",
    empoweringDigitalCommerce: "تمكين التجارة الرقمية 💻",
    aboutDescription:
      "🔗 Nexo هو السوق الأول للأصول الرقمية الخاصة بالألعاب. نحن نربط المشترين والبائعين في بيئة آمنة وشفافة حيث تأتي الثقة والجودة في المقام الأول.",
    activeUsers: "المستخدمون النشطون 👥",
    productsSold: "المنتجات المباعة 📦",
    countries: "الدول 🌍",
    ourStory: "قصتنا 📖",
    buildingFuture: "نبني مستقبل الأسواق الرقمية 🚀",
    storyParagraph1:
      "📆 تأسست Nexo في عام 2024 انطلاقًا من ملاحظة بسيطة: سوق الألعاب الرقمية كان مجزأً، غير آمن، ويفتقر إلى الثقة التي تتطلبها التجارة الحديثة.",
    storyParagraph2:
      "💡 قررنا تغيير ذلك. من خلال الجمع بين التكنولوجيا المتطورة وعمليات التحقق الصارمة ونهج يضع العميل أولًا، أنشأنا منصة تجعل تداول الأصول الرقمية سهلًا وآمنًا كما يجب أن يكون.",
    storyParagraph3:
      "🤝 اليوم، Nexo أكثر من مجرد سوق – إنها مجتمع. مكان يلتقي فيه اللاعبون، وتنمو فيه التجارة، وتزدهر فيه التجارة الرقمية في بيئة آمنة وشفافة.",
    ourValues: "قيمنا 🌟",
    principlesGuide: "المبادئ التي توجه كل ما نقوم به 🧭",
    securityFirst: "الأمان أولًا 🔐",
    securityFirstDesc: "سلامتك هي أولويتنا القصوى. نستخدم أحدث معايير الأمان لحماية كل معاملة.",
    lightningFast: "سرعة البرق ⚡",
    lightningFastDesc: "تسليم فوري للمنتجات الرقمية. لا انتظار ولا تأخير – احصل على ما دفعت مقابله فورًا.",
    qualityAssured: "جودة مضمونة ✅",
    qualityAssuredDesc: "كل منتج وبائع يتم التحقق منه. نحافظ دائمًا على أعلى المعايير في السوق.",
    communityDriven: "بُني من أجل المجتمع 👥",
    communityDrivenDesc: "صُمم بواسطة اللاعبين ولأجلهم. نصغي لمجتمعنا ونتطور باستمرار بناءً على ملاحظاتهم.",
    ourMission: "مهمتنا 🎯",
    missionStatement:
      "🎮 إنشاء السوق الرقمي الأكثر موثوقية في العالم حيث يمكن للاعبين الشراء والبيع والتداول بثقة تامة، مع العلم أن معاملاتهم آمنة وأصولهم موثقة وأن مجتمعهم يضع النزاهة فوق كل شيء.",

    // Pricing Page
    sellerPlans: "خطط البائع 💼",
    startSellingToday: "ابدأ البيع اليوم 🚀",
    choosePerfectPlan: "اختر الخطة المثالية لعملك. يمكنك الترقية أو التخفيض في أي وقت 🔄",
    mostPopular: "الأكثر شيوعًا ⭐",
    free: "مجاني 💸",
    forever: "مدى الحياة ⏱️",
    perfectForGettingStarted: "مثالي للبداية 🪄",
    pro: "احترافي 💼",
    perMonth: "شهريًا 📅",
    forSeriousSellers: "للبائعين الجادين 💪",
    elite: "نخبة 🏆",
    forTopTierSellers: "لأصحاب المستوى الأعلى 🚀",
    getStarted: "ابدأ الآن ▶️",
    upgradeNow: "قم بالترقية الآن ⬆️",
    whatsIncluded: "ما يتضمنه العرض:",
    listUpTo3Products: "إدراج ما يصل إلى 3 منتجات 📦",
    transactionFee5: "رسوم معاملة 5٪ 💳",
    basicSellerProfile: "ملف بائع أساسي 👤",
    communitySupport: "دعم المجتمع 🤝",
    standardVerification: "توثيق قياسي ✅",
    featuredListings: "قوائم مميزة 🌟",
    prioritySupport: "دعم أولوية 🧑‍💻",
    advancedAnalytics: "تحليلات متقدمة 📊",
    customBranding: "علامة تجارية مخصصة ✨",
    unlimitedProductListings: "إدراج غير محدود للمنتجات 📦",
    transactionFee3: "رسوم معاملة 3٪",
    enhancedSellerProfile: "ملف بائع مطوّر 📈",
    fastTrackVerification: "توثيق سريع ⚡",
    featuredListings5PerMonth: "قوائم مميزة (5 شهريًا)",
    customProfileBanner: "بانر ملف شخصي مخصص 🎨",
    dedicatedAccountManager: "مدير حساب مخصص 👨‍💼",
    apiAccess: "وصول API 🔌",
    everythingInPro: "كل ما في الخطة الاحترافية +",
    transactionFee1_5: "رسوم معاملة 1.5٪",
    verifiedBadge: "شارة موثقة ✅",
    unlimitedFeaturedListings: "قوائم مميزة غير محدودة 🌟",
    earlyAccessToFeatures: "وصول مبكر للميزات 🔑",
    premiumSupport24_7: "دعم مميز (24/7) 📞",
    promotedInLeaderboard: "ترقية في قائمة المتصدرين 🏆",
    faqTitle: "الأسئلة الشائعة ❓",
    faqQuestion1: "📅 هل يمكنني تغيير الخطة في أي وقت؟",
    faqAnswer1: "✅ نعم! يمكنك الترقية أو التخفيض في أي وقت وتُطبق التغييرات فورًا.",
    faqQuestion2: "💳 ما طرق الدفع التي تقبلونها؟",
    faqAnswer2: "نقبل جميع البطاقات الائتمانية الكبرى، PayPal، والمدفوعات بالعملات الرقمية.",
    faqQuestion3: "🔁 هل توجد سياسة استرجاع؟",
    faqAnswer3: "نعم، نقدم ضمان استرجاع الأموال خلال 30 يومًا إذا لم تكن راضيًا عن خطتك.",

    // Login Page
    welcomeBack: "مرحبًا بعودتك 👋",
    signInToAccount: "سجّل دخولك إلى حساب Nexo 🔐",
    emailAddress: "البريد الإلكتروني 📧",
    password: "كلمة المرور 🔑",
    rememberMe: "تذكرني ✔️",
    forgotPassword: "نسيت كلمة المرور؟ 🤔",
    cloudflareTurnstile: "🔒 Cloudflare Turnstile CAPTCHA",
    signIn: "تسجيل الدخول ▶️",
    orContinueWith: "أو تابع باستخدام:",
    dontHaveAccount: "ليس لديك حساب؟",

    // Register Page
    joinNexoMarketplace: "انضم إلى سوق Nexo اليوم 🛍️",
    chooseUsername: "اختر اسم مستخدم 👤",
    createStrongPassword: "أنشئ كلمة مرور قوية 🔐",
    passwordRequirements: "يجب أن تكون 8 أحرف على الأقل وتحتوي على أرقام ورموز 📏",
    confirmPassword: "تأكيد كلمة المرور ✅",
    confirmYourPassword: "أكّد كلمة المرور الخاصة بك 🔁",
    iAgreeToThe: "أوافق على",
    and: "و",
    alreadyHaveAccount: "لديك حساب بالفعل؟",

    // MobileNav
    wishlist: "قائمة الرغبات ❤️",

    // Cart Page
    shoppingCart: "سلة التسوق 🛒",
    itemsInCart: "عناصر في سلتك",
    quantity: "الكمية 🔢",
    remove: "إزالة 🗑️",
    enterCouponCode: "أدخل كود الخصم 🎟️",
    apply: "تطبيق ✅",
    orderSummary: "ملخص الطلب 📄",
    subtotal: "الإجمالي الفرعي 💵",
    serviceFee: "رسوم الخدمة 💼",
    total: "الإجمالي 💰",
    proceedToCheckout: "المتابعة للدفع 💳",
    continueShopping: "متابعة التسوق 🛍️",
    secureCheckout: "دفع آمن 🔐",
    instantDelivery: "تسليم فوري ⚡",
    moneyBackGuarantee: "ضمان استرجاع الأموال 💸",

    // Wishlist Page
    myWishlist: "قائمة رغباتي ❤️",
    itemsSavedForLater: "عناصر محفوظة لاحقًا ⏱️",
    addAllToCart: "أضف الكل إلى السلة 🛒",
    clearWishlist: "مسح القائمة 🗑️",
    yourWishlistIsEmpty: "قائمة رغباتك فارغة 😔",
    startAddingProducts: "ابدأ بإضافة المنتجات التي تعجبك لتتبعها 📦",

    // Checkout Page
    checkout: "الدفع 💳",
    completePurchaseSecurely: "أكمل عملية الشراء بأمان 🔐",
    contactInformation: "معلومات التواصل 📞",
    paymentMethod: "طريقة الدفع 💳",
    creditDebitCard: "بطاقة ائتمان / خصم 💳",
    payWithCard: "ادفع باستخدام بطاقتك 💸",
    walletBalance: "رصيد المحفظة 💼",
    useYourWallet: "استخدم محفظتك 🏦",
    cardNumber: "رقم البطاقة 💳",
    expiryDate: "تاريخ الانتهاء 📅",
    cvc: "CVC 🔐",
    iAgreeToTerms: "أوافق على",
    refundPolicyLink: "سياسة الاسترجاع 📜",
    allSalesFinal: "وأفهم أن جميع المبيعات نهائية بمجرد تسليم المنتج ✅",
    completePurchase: "إتمام الشراء 🛍️",
    secureEncryptedPayment: "دفع آمن ومشفر 🔒",
    sevenDayGuarantee: "ضمان استرجاع خلال 7 أيام 📆",

    // Help Center Page
    howCanWeHelp: "كيف يمكننا مساعدتك؟ 🤝",
    searchKnowledgeBase: "ابحث في قاعدة المعرفة أو تصفح الفئات أدناه 🔎",
    searchHelpArticles: "ابحث عن مقالات المساعدة، الأسئلة الشائعة أو المواضيع...",
    browseByCategory: "تصفح حسب الفئة 📂",
    articlesCount: "مقالات 📚",
    gettingStarted: "البدء 🚀",
    ordersDelivery: "الطلبات والتسليم 📦",
    paymentsRefunds: "المدفوعات والاسترجاع 💳",
    accountManagement: "إدارة الحساب 👤",
    securityPrivacy: "الأمان والخصوصية 🔐",
    sellerTools: "أدوات البائع 🛠️",
    frequentlyAskedQuestions: "الأسئلة الشائعة ❓",
    quickAnswers: "إجابات سريعة ⚡",
    stillNeedHelp: "ما زلت بحاجة للمساعدة؟ 🤔",
    supportTeamAssist: "فريق الدعم هنا لمساعدتك 👨‍💻",
    liveChat: "دردشة مباشرة 💬",
    liveChatDesc: "تحدث مع فريق الدعم في الوقت الفعلي 🕐",
    startChat: "ابدأ الدردشة 💬",
    emailSupport: "الدعم عبر البريد 📧",
    emailSupportDesc: "أرسل لنا بريدًا وسنرد خلال 24 ساعة ⏱️",
    sendEmail: "إرسال البريد ✉️",

    // Footer
    marketplace: "السوق 🏪",
    allRightsReserved: "جميع الحقوق محفوظة ©",
    company: "الشركة 🏢",
    support: "الدعم 🤝",
    legal: "قانوني ⚖️",
    termsOfService: "شروط الخدمة 📜",
    privacyPolicy: "سياسة الخصوصية 🔐",

    // Leaderboard
    topPerformers: "أفضل المؤدين 🏆",
    leaderboardDesc: "اكتشف أفضل البائعين، وأكثر المنتجات شهرة، والمشترين الأكثر نشاطًا في مجتمع Nexo 👥",
    topSellers: "أفضل البائعين 💼",
    topProducts: "أفضل المنتجات 📦",
    topBuyers: "أفضل المشترين 🛍️",
    sales: "مبيعات 💰",
    totalRevenue: "إجمالي الإيرادات 📊",
    sold: "تم البيع ✅",
    purchases: "عمليات الشراء 🛒",
    totalSpent: "إجمالي الإنفاق 💵",
    by: "بواسطة",
    refundPolicy: "سياسة الاسترجاع 📜",
    disputeCenter: "مركز النزاعات ⚖️",
    verifiedSellers: "البائعون الموثقون ✅",
    builtForGamers: "صُمم 💜 لعشاق الألعاب 🎮",
    sellOnNexo: "بع على Nexo 💼",
    legalAndSupport: "القانوني والدعم ⚖️🤝",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage) {
      setLanguageState(savedLanguage);
      document.documentElement.lang = savedLanguage;
      document.documentElement.dir = savedLanguage === "ar" ? "rtl" : "ltr";
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  };

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)["en"]] || key;
  };

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};
