import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Starfield from "@/components/Starfield";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Search, 
  HelpCircle, 
  Shield,
  ShoppingCart,
  CreditCard,
  Package,
  UserCircle,
  Settings
} from "lucide-react";

// Discord SVG icon
const DiscordIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);

const categories = [
  { icon: ShoppingCart, name: "Getting Started", count: 12 },
  { icon: Package, name: "Orders & Delivery", count: 15 },
  { icon: CreditCard, name: "Payments & Refunds", count: 18 },
  { icon: UserCircle, name: "Account Management", count: 10 },
  { icon: Shield, name: "Security & Privacy", count: 14 },
  { icon: Settings, name: "Seller Tools", count: 20 },
];

const faqs = [
  {
    category: "Getting Started",
    questions: [
      {
        q: "How do I create an account?",
        a: "Click the 'Sign Up' button in the top right corner, enter your email and create a password. You'll receive a verification email to activate your account.",
      },
      {
        q: "Is it free to browse products?",
        a: "Yes, browsing and searching for products is completely free. You only pay when you make a purchase.",
      },
      {
        q: "How do I search for specific products?",
        a: "Use the search bar at the top of any page, or browse by category. You can also use filters to narrow down your results.",
      },
    ],
  },
  {
    category: "Orders & Delivery",
    questions: [
      {
        q: "How quickly will I receive my digital product?",
        a: "Most digital products are delivered instantly after payment confirmation. Check your email and account dashboard for delivery details.",
      },
      {
        q: "Can I track my order status?",
        a: "Yes, go to your Account Dashboard > Orders to see the status of all your purchases.",
      },
      {
        q: "What if I don't receive my product?",
        a: "If you haven't received your product within 24 hours, contact our support team. We offer a 7-day money-back guarantee.",
      },
    ],
  },
  {
    category: "Payments & Refunds",
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit cards, PayPal, and cryptocurrency payments through secure payment gateways.",
      },
      {
        q: "Is my payment information secure?",
        a: "Yes, we use industry-standard SSL encryption and never store your complete card details. All payments are processed through secure third-party providers.",
      },
      {
        q: "How do refunds work?",
        a: "If you're not satisfied with your purchase, request a refund within 7 days. Refunds are processed within 5-7 business days to your original payment method.",
      },
      {
        q: "Are there any hidden fees?",
        a: "No, the price you see is the price you pay. There are no hidden fees or charges.",
      },
    ],
  },
  {
    category: "Security & Privacy",
    questions: [
      {
        q: "How do you protect my personal information?",
        a: "We use advanced encryption and follow strict privacy policies. Your data is never shared with third parties without your consent.",
      },
      {
        q: "Are the products verified?",
        a: "Yes, all products and sellers go through a verification process before being listed on our marketplace.",
      },
      {
        q: "What if I suspect fraudulent activity?",
        a: "Report any suspicious activity immediately through our support channels. We take fraud very seriously and investigate all reports.",
      },
    ],
  },
  {
    category: "Seller Tools",
    questions: [
      {
        q: "How do I become a seller?",
        a: "Click 'Become a Seller' in the navigation menu, complete the registration form, and wait for account approval. Most approvals happen within 24-48 hours.",
      },
      {
        q: "What are the seller fees?",
        a: "Free accounts have a 5% transaction fee, Pro accounts 3%, and Elite accounts 1.5%. View our Pricing page for full details.",
      },
      {
        q: "When do I receive payment for my sales?",
        a: "Payments are processed within 24 hours of a successful sale and transferred to your wallet. You can withdraw funds anytime.",
      },
    ],
  },
];

const HelpCenter = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter FAQs based on selected category and search
  const filteredFaqs = faqs.filter(section => {
    if (selectedCategory && section.category !== selectedCategory) return false;
    if (searchQuery) {
      return section.questions.some(q => 
        q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.a.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col relative">
      <Starfield />
      <Navbar />
      
      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden border-b border-border/30">
          <div className="absolute inset-0 gradient-nebula opacity-60" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center space-y-6 max-w-3xl mx-auto">
              <div className="inline-flex p-3 rounded-xl glass-card border border-primary/30 mb-4">
                <HelpCircle className="h-8 w-8 text-primary" />
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                How Can We Help?
              </h1>
              <p className="text-lg text-foreground/60">
                Search our knowledge base or browse categories below
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto pt-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary/70" />
                  <Input
                    type="search"
                    placeholder="Search for help articles, FAQs, or topics..."
                    className="w-full pl-12 pr-4 h-14 glass-card border-primary/30 focus:border-primary/50 text-base"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-black text-center mb-12 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Browse by Category
            </h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Card
                    key={category.name}
                    className="glass-card p-6 cursor-pointer hover:scale-[1.02] transition-all group"
                    onClick={() => {
                      setSelectedCategory(category.name);
                      document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 group-hover:border-primary/40 transition-colors">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-sm text-foreground/60">
                          {category.count} articles
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        <section id="faq-section" className="py-16 relative">
          <div className="absolute inset-0 bg-gradient-cosmic opacity-30" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-foreground/60 text-lg">
                Quick answers to common questions
              </p>
              {selectedCategory && (
                <div className="mt-4">
                  <Badge className="badge-glow border-0">
                    {selectedCategory}
                  </Badge>
                  <Button 
                    variant="link" 
                    size="sm"
                    onClick={() => setSelectedCategory(null)}
                    className="ml-2 text-primary"
                  >
                    Show All
                  </Button>
                </div>
              )}
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
              {filteredFaqs.map((section) => (
                <Card key={section.category} className="glass-card p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Badge className="badge-glow border-0">
                      {section.category}
                    </Badge>
                  </div>
                  <Accordion type="single" collapsible className="space-y-2">
                    {section.questions.map((faq, index) => (
                      <AccordionItem
                        key={index}
                        value={`${section.category}-${index}`}
                        className="glass-card border border-border/30 rounded-lg px-4"
                      >
                        <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary transition-colors">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-foreground/70 leading-relaxed">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 border-t border-border/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
                Still Need Help?
              </h2>
              <p className="text-foreground/60 text-lg">
                Our support team is here to assist you
              </p>
            </div>

            <div className="max-w-xl mx-auto">
              <Card className="glass-card p-8 text-center">
                <div className="inline-flex p-4 rounded-xl bg-primary/10 border border-primary/20 mb-4">
                  <DiscordIcon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Discord Support</h3>
                <p className="text-foreground/60 mb-6">
                  Join our Discord community for instant support and assistance
                </p>
                <Button 
                  className="btn-glow"
                  onClick={() => window.open('https://discord.gg/Jk3zxyDb', '_blank')}
                >
                  Join Discord Server
                </Button>
                <p className="text-xs text-foreground/50 mt-4">
                  Our team responds within minutes on Discord
                </p>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default HelpCenter;