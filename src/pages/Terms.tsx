import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Starfield from "@/components/Starfield";
import { Card } from "@/components/ui/card";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Starfield />
      <Navbar />
      
      <main className="flex-1 relative z-10 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
              Terms of Service
            </h1>
            <p className="text-foreground/60">Last updated: January 2024</p>
          </div>

          <Card className="glass-card p-8 md:p-12 space-y-8 text-foreground/80 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Nexo Marketplace ("the Platform"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">2. Use License</h2>
              <p className="mb-4">
                Permission is granted to temporarily download one copy of the materials on Nexo Marketplace for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Attempt to decompile or reverse engineer any software</li>
                <li>Remove any copyright or other proprietary notations</li>
                <li>Transfer the materials to another person</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">3. Account Registration</h2>
              <p className="mb-4">
                To use certain features of the Platform, you must register for an account. You agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your information to keep it accurate</li>
                <li>Maintain the security of your password</li>
                <li>Accept all risks of unauthorized access to your account</li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">4. Buyer Responsibilities</h2>
              <p className="mb-4">
                As a buyer on the Platform, you agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Purchase products only for lawful purposes</li>
                <li>Pay for all purchases in full and on time</li>
                <li>Verify product details before completing purchase</li>
                <li>Contact sellers for any issues before opening disputes</li>
                <li>Provide honest reviews and feedback</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">5. Seller Responsibilities</h2>
              <p className="mb-4">
                As a seller on the Platform, you agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>List only legitimate products you have the right to sell</li>
                <li>Provide accurate product descriptions and images</li>
                <li>Deliver products promptly after payment</li>
                <li>Respond to buyer inquiries in a timely manner</li>
                <li>Honor refund and return policies</li>
                <li>Maintain a professional standard of conduct</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">6. Prohibited Activities</h2>
              <p className="mb-4">
                You may not use the Platform to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Engage in fraudulent or illegal activities</li>
                <li>Sell stolen or counterfeit products</li>
                <li>Manipulate reviews or ratings</li>
                <li>Harass or abuse other users</li>
                <li>Attempt to bypass platform fees</li>
                <li>Use automated systems or bots</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">7. Fees and Payments</h2>
              <p>
                Nexo charges a service fee on all transactions. Sellers are responsible for all applicable fees. Payment processing is handled securely through our payment partners. All fees are non-refundable unless otherwise stated.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">8. Intellectual Property</h2>
              <p>
                The Platform and its original content, features, and functionality are owned by Nexo and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">9. Termination</h2>
              <p>
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including breach of these Terms. Upon termination, your right to use the Platform will immediately cease.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">10. Limitation of Liability</h2>
              <p>
                In no event shall Nexo, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">11. Governing Law</h2>
              <p>
                These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">12. Contact Us</h2>
              <p className="mb-4">
                If you have any questions about these Terms, please join our Discord community:
              </p>
              <a 
                href="https://discord.gg/Jk3zxyDb" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Click here
              </a>
            </section>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Terms;
