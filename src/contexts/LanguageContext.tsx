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
    comingSoon: "Coming Soon",

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
products: "المنتجات 🎮",
members: "الأعضاء 👥",
leaderboard: "الترتيب 🏆",
becomeASeller: "كن بائعًا 💼",
login: "تسجيل الدخول 🔐",
register: "إنشاء حساب ✨",
about: "من نحن ℹ️",
    help: "مركز المساعدة 💬",

    // Hero
welcomeMessage: "مرحبًا بك في منصة نيكسو 👋",
heroTitle: "سوقك الرقمي للألعاب والمنتجات الرقمية 🎮💻",
heroDescription: "اشترِ وبِع حسابات الألعاب والسوشيال ميديا والمنتجات الرقمية بكل أمان وثقة، في منصة حديثة وسريعة.",
exploreProducts: "استكشف المنتجات 🔎",

    // Common
addToCart: "أضف إلى السلة 🛒",
price: "السعر 💰",
category: "الفئة 🗂️",
rating: "التقييم ⭐",
search: "بحث 🔍",
filter: "فلتر 🔧",
filters: "الفلاتر ⚙️",
sortBy: "ترتيب حسب 📊",
allCategories: "كل الفئات 🗂️",
loadMore: "عرض المزيد ⏬",
submit: "إرسال 📤",
cancel: "إلغاء ❌",
save: "حفظ 💾",
edit: "تعديل ✏️",
delete: "حذف 🗑️",
back: "رجوع ⬅️",
next: "التالي ➡️",
previous: "السابق ⏮️",
required: "إلزامي ⚠️",
optional: "اختياري 🪶",
comingSoon: "قريبًا ⏰",


    // KYC Verification
    kyc: {
verification: "التحقق من الهوية 🪪",
verificationStatus: "حالة التحقق 📋",
verificationOverview: "نظرة عامة على التحقق 👀",
verificationOverviewDescription: "عشان تبدأ البيع في المنصة، لازم تكمل التحقق من الهوية لضمان الأمان والثقة بين الجميع.",
verificationSteps: "خطوات التحقق 🧭",
verificationRequired: "التحقق مطلوب ⚠️",
verificationRequiredDescription: "لازم تكمل التحقق من الهوية قبل ما تدخل لوحة البائع.",
verificationIncomplete: "التحقق غير مكتمل ⏳",
fullyVerified: "تم التحقق بالكامل ✅",
verificationRejected: "تم رفض التحقق ❌",
underReview: "قيد المراجعة 🔎",
sellerAccessRestricted: "وصول البائع محدود 🚫",
sellerAccessRestrictedDescription: "لازم تكمل التحقق من الهوية عشان تقدر تستخدم أدوات البيع.",
requiredSteps: "الخطوات المطلوبة 📑",
completeVerification: "أكمل التحقق الآن 🧾",
backToAccount: "رجوع للحساب 🔙",
verificationBenefits: "مزايا التحقق 🎁",
benefit1: "الوصول إلى لوحة البائع 🧮",
benefit2: "إمكانية عرض المنتجات 💼",
benefit3: "مدفوعات آمنة 🔒",
benefit4: "حماية للبائع والمشتري 🛡️",
startVerification: "ابدأ التحقق 🚀",
resubmitDocuments: "إعادة إرسال المستندات 📤",
goToSellerDashboard: "الذهاب إلى لوحة البائع 📊",
complete: "إكمال ✅",
back: "رجوع ⬅️",
continue: "استمرار ➡️",
overview: "نظرة عامة 👁️",

      
      // Email Verification
emailVerification: "التحقق من البريد الإلكتروني ✉️",
emailDescription: "تحقق من بريدك الإلكتروني عبر رابط التأكيد.",

      
      // Identity Verification
identityVerification: "التحقق من الهوية الشخصية 🧾",
identityDescription: "تحقق من هويتك باستخدام بطاقة هوية رسمية.",
firstName: "الاسم الأول",
lastName: "اسم العائلة",
dateOfBirth: "تاريخ الميلاد 🎂",
nationality: "الجنسية 🌍",
idNumber: "رقم الهوية 🆔",

      
      // Address Verification
addressVerification: "التحقق من العنوان 🏠",
addressDescription: "أكد عنوان سكنك الحالي.",
streetAddress: "اسم الشارع",
city: "المدينة 🏙️",
state: "المنطقة / المحافظة",
postalCode: "الرمز البريدي 📮",
country: "الدولة 🌍",

      
      // Phone Verification
phoneVerification: "التحقق من رقم الجوال 📱",
phoneDescription: "أكد رقم جوالك للتواصل.",
phoneNumber: "رقم الجوال 📞",
phoneVerificationNote: "ملاحظة التحقق 🔔",
phoneVerificationNoteDescription: "راح يوصلك كود تحقق على رقم جوالك.",
sendVerificationCode: "إرسال كود التحقق 📤",

      
      // Document Upload
documentUpload: "رفع المستندات 📁",
documentDescription: "ارفع الملفات المطلوبة للتحقق.",
idFront: "الوجه الأمامي للهوية 🪪",
idFrontDescription: "صورة واضحة للوجه الأمامي من البطاقة.",
idBack: "الوجه الخلفي للهوية 🪪",
idBackDescription: "صورة واضحة للوجه الخلفي من البطاقة.",
selfie: "صورة سيلفي 🤳",
selfieDescription: "صورة سيلفي وأنت تمسك الهوية بيدك.",
proofOfAddress: "إثبات العنوان 🧾",
proofOfAddressDescription: "فاتورة أو مستند يثبت عنوانك.",

      
      // Bank Account Verification
bankAccountVerification: "التحقق من الحساب البنكي 🏦",
bankAccountDescription: "أكد بيانات حسابك البنكي لاستلام الأرباح.",
accountHolderName: "اسم صاحب الحساب 💳",
bankName: "اسم البنك 🏛️",
accountNumber: "رقم الحساب 🔢",
routingNumber: "رمز التحويل البنكي 🧾",
accountType: "نوع الحساب 🏷️",
bankAccountSecurity: "أمان الحساب البنكي 🔒",
bankAccountSecurityDescription: "معلوماتك البنكية محفوظة ومشفّرة بأعلى معايير الأمان.",

    },

    // Products
allProducts: "كل المنتجات 🛒",
browseProducts: "تصفح آلاف المنتجات الرقمية والحسابات الموثقة 🔎",
searchPlaceholder: "ابحث عن المنتجات أو الحسابات أو الخدمات...",
showing: "عرض",
of: "من",
productsText: "منتجات",
noProductsFound: "ما فيه منتجات تطابق الفلاتر 🔍",
featured: "مميز ⭐",
priceLowToHigh: "السعر: من الأقل إلى الأعلى ⬆️",
priceHighToLow: "السعر: من الأعلى إلى الأقل ⬇️",
highestRated: "الأعلى تقييمًا 🌟",
newestFirst: "الأحدث أولاً 🆕",


    // Price Ranges
allPrices: "كل الأسعار 💰",
under100: "أقل من 100$ 💵",
range100to300: "من 100$ إلى 300$ 💸",
range300to500: "من 300$ إلى 500$ 💳",
over500: "أكثر من 500$ 💎",


    // Categories
socialMedia: "سوشال ميديا 📱",
gaming: "ألعاب 🎮",
digitalServices: "خدمات رقمية 💼",
software: "برامج 💻",
entertainment: "ترفيه 🎬",


    // Games Page
gamingMarketplace: "سوق الألعاب 🎯",
gameAccounts: "حسابات الألعاب 🎮",
gameAccountsDesc: "اشترِ حسابات ألعاب جاهزة من كل المنصات الكبيرة، مضمونة ومتحققة وآمنة.",
searchGames: "ابحث عن الحسابات أو الألعاب أو المنصات...",
activeListings: "العروض النشطة 📦",
successRate: "نسبة النجاح ✅",
support247: "دعم 24/7 💬",
browseByPlatform: "تصفح حسب المنصة 🕹️",
choosePlatform: "اختر منصة اللعب الخاصة بك",
featuredAccounts: "حسابات مميزة ⭐",
premiumVerified: "حسابات مميزة ومتحققة 🔒",
viewAll: "عرض الكل 👀",
verifiedAccounts: "حسابات موثقة ✅",
verifiedAccountsDesc: "كل الحسابات يتم التحقق منها قبل النشر",
instantAccess: "وصول فوري ⚡",
instantAccessDesc: "تحصل على تفاصيل الحساب فور الشراء",
moneyBack: "استرجاع المبلغ 💰",
moneyBackDesc: "ضمان استرجاع خلال 7 أيام من الشراء",
accounts: "حسابات",


    // Seller
listProduct: "أضف منتجك للبيع 🛒",
sellOn: "بع على نكسو 💼",
sellerDashboard: "لوحة البائع 📊",
startSellingOn: "ابدأ البيع على",
chooseWhatToSell: "وش ودك تبيع؟ 🤔",
sellerOnboardingDesc: "اختر وش تبي تبيع وابدأ خلال دقايق، بدون رسوم مسبقة — بس اعرض وربحك يجيك 💸",
trustedBy: "موثوق من أكثر من 10,000 بائع 🔒",
quickSetup: "إعداد سريع ⚡",
securePayments: "دفعات آمنة 💳",
lowFees: "رسوم منخفضة 💰",
socialMediaAccounts: "حسابات سوشيال ميديا 📱",
gamingAccounts: "حسابات ألعاب 🎮",
sellSocialDesc: "بع حساباتك على إنستقرام، تيك توك، يوتيوب، تويتر وغيرها 📲",
sellGamingDesc: "بع حسابات Steam، PlayStation، Xbox، Epic Games وغيرها 🎮",
listSocialAccount: "اعرض حساب سوشيال ميديا 🌐",
listGamingAccount: "اعرض حساب ألعاب 🎮",
whySellOnNexo: "ليش تبيع على نكسو؟ 🤝",
fastPayouts: "تحويلات سريعة ⚡",
fastPayoutsDesc: "استلم أرباحك بسرعة بعد البيع مع خيارات سحب متعددة",
buyerProtection: "حماية المشتري 🛡️",
buyerProtectionDesc: "نظام حماية وضمان شامل ضد الاحتيال أو المشاكل",
largeAudience: "جمهور كبير 👥",
largeAudienceDesc: "وصّل منتجاتك لآلاف المشترين النشطين يوميًا",


    // Seller Forms
accountInformation: "معلومات الحساب 🔐",
title: "العنوان ✏️",
username: "اسم المستخدم 👤",
platform: "المنصة 🎮",
game: "اللعبة 🕹️",
accountDescription: "وصف الحساب 📝",
selectPlatform: "اختر المنصة",
selectGame: "اختر اللعبة",
configurationSetup: "إعداد التكوين ⚙️",
setupInstructions: "تعليمات الإعداد 📄",
phoneNumber: "رقم الجوال 📞",
ifApplicable: "إذا كان ينطبق",
sellerType: "نوع البائع 🧾",
individual: "فردي 👤",
business: "شركة 🏢",
verifiedSeller: "بائع موثق ✅",
pricingInformation: "معلومات السعر 💰",
discountPrice: "السعر بعد الخصم 💸",
discountDescription: "وصف الخصم 🎯",
accountScreenshots: "صور الحساب 📸",
uploadImage: "رفع صورة 📤",
termsAndConditions: "الشروط والأحكام ⚖️",
submitAccount: "إرسال الحساب 📬",
accountListedSuccess: "تم عرض الحساب بنجاح ✅",
accountSubmittedReview: "تم إرسال حسابك للمراجعة 🔎",
termsRequired: "يجب الموافقة على الشروط ⚠️",
agreeToTerms: "الرجاء الموافقة على كل الشروط والأحكام",


    // Form Placeholders
enterUsername: "اكتب اسم المستخدم فقط",
provideDescription: "اكتب وصف واضح ومفصل للحساب",
enterInstructions: "اكتب التعليمات (أو بيانات الحساب أو البنك)",
enterPhoneNumber: "اكتب رقم الجوال (مثلاً +966...)",
enterPrice: "اكتب السعر المطلوب 💰",
enterDiscountPrice: "اكتب السعر بعد الخصم (اختياري)",
selectSellerType: "اختر نوع البائع",
uploadScreenshots: "ارفع صور أو لقطات للحساب (بحد أقصى 6 صور)",


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
orders: "طلباتي 🧾",
wallet: "المحفظة 💰",
notifications: "الإشعارات 🔔",
billing: "الفواتير 💳",
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
    faqQuestion1: "هل أقدر أغيّر الخطة في أي وقت؟",
    faqAnswer1: "أكيد! تقدر ترقي أو تنزل الخطة وقت ما تبغى، والتغييرات تطبق فورًا.",
    faqQuestion2: "وش طرق الدفع اللي تقبلوها؟ 💳",
    faqAnswer2: "نقبل كل بطاقات الائتمان الرئيسية، باي بال، والعملات الرقمية. 💰",
    faqQuestion3: "هل فيه سياسة استرجاع؟ 🔄",
    faqAnswer3: "نعم، تقدر تسترجع خلال 30 يوم إذا ما كنت راضي عن الخطة.",

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
shoppingCart: "سلة المشتريات 🛒",
itemsInCart: "العناصر في سلتك 🧾",
quantity: "الكمية 🔢",
remove: "إزالة 🗑️",
enterCouponCode: "أدخل كود الخصم 🎟️",
apply: "تطبيق ✅",
orderSummary: "ملخص الطلب 📋",
subtotal: "الإجمالي الفرعي 💵",
serviceFee: "رسوم الخدمة 💼",
total: "الإجمالي الكلي 💰",
proceedToCheckout: "المتابعة للدفع 💳",
continueShopping: "الرجوع للتسوق 🛍️",
secureCheckout: "دفع آمن 🔒",
instantDelivery: "تسليم فوري ⚡",
moneyBackGuarantee: "ضمان استرجاع المبلغ 💰",
yourCartIsEmpty: "سلتك فاضية 😅",
itemRemoved: "تمت الإزالة ✅",
itemHasBeenRemoved: "تمت إزالة المنتج من السلة.",
error: "خطأ ❌",
pleaseEnterCoupon: "رجاءً أدخل كود الخصم.",
invalidCoupon: "كود الخصم غير صالح ⚠️",
pleaseCheckWithAdmin: "تحقق من الإدارة للتأكد من صحة الكود.",


    // Wishlist Page
myWishlist: "المفضلة 💖",
itemsSavedForLater: "منتجات محفوظة للرجوع لاحقًا 🕒",
addAllToCart: "إضافة الكل للسلة 🛒",
clearWishlist: "مسح المفضلة 🧹",
yourWishlistIsEmpty: "قائمة المفضلة فاضية 😅",
startAddingProducts: "ابدأ بإضافة المنتجات اللي تعجبك ❤️",


    // Checkout Page
checkout: "الدفع 💳",
completePurchaseSecurely: "أكمل عملية الشراء بأمان 🔒",
contactInformation: "معلومات التواصل 📞",
paymentMethod: "طريقة الدفع 💰",
creditDebitCard: "بطاقة ائتمان / خصم 💳",
payWithCard: "ادفع باستخدام البطاقة 💳",
walletBalance: "رصيد المحفظة 💼",
useYourWallet: "استخدم محفظتك",
cardNumber: "رقم البطاقة 💳",
expiryDate: "تاريخ الانتهاء 📅",
cvc: "رمز CVC 🔢",
iAgreeToTerms: "أوافق على",
refundPolicyLink: "سياسة الاسترجاع",
allSalesFinal: "وأفهم أن جميع المبيعات نهائية بعد تسليم المنتج.",
completePurchase: "إكمال الشراء ✅",
secureEncryptedPayment: "دفع آمن ومشفّر 🔒",
sevenDayGuarantee: "ضمان استرجاع خلال 7 أيام 💰",


    // Help Center Page
howCanWeHelp: "وش نقدر نساعدك فيه؟ 🤔",
searchKnowledgeBase: "ابحث في مركز المعرفة أو تصفّح الأقسام 👇",
searchHelpArticles: "ابحث عن مقالات المساعدة أو الأسئلة الشائعة...",
browseByCategory: "تصفّح حسب الفئة 📚",
articlesCount: "مقالات 📄",
gettingStarted: "البدء 👣",
ordersDelivery: "الطلبات والتسليم 🚚",
paymentsRefunds: "المدفوعات والاسترجاع 💳",
accountManagement: "إدارة الحساب 👤",
securityPrivacy: "الأمان والخصوصية 🔒",
sellerTools: "أدوات البائع ⚙️",
frequentlyAskedQuestions: "الأسئلة الشائعة ❓",
quickAnswers: "إجابات سريعة على أكثر الأسئلة تكرارًا ⚡",
stillNeedHelp: "لسه تحتاج مساعدة؟ 💬",
supportTeamAssist: "فريق الدعم موجود عشان يساعدك 🙌",
liveChat: "الدردشة المباشرة 💭",
liveChatDesc: "تواصل مع فريق الدعم في الوقت الفعلي.",
startChat: "ابدأ الدردشة 💬",
emailSupport: "الدعم عبر الإيميل 📧",
emailSupportDesc: "أرسل لنا رسالة، ونرد عليك خلال 24 ساعة ⏱️",
sendEmail: "إرسال الإيميل 📤",
discordSupport: "دعم ديسكورد 🎧",


    // Footer
    marketplace: "السوق 🏪",
    allRightsReserved: "جميع الحقوق محفوظة ©",
    company: "الشركة 🏢",
    support: "الدعم 💬",
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
    const translation = translations[language][key as keyof (typeof translations)["en"]];
    if (typeof translation === 'string') {
      return translation;
    }
    return key;
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
