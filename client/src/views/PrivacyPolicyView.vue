<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
  <div
    class="min-h-screen bg-white dark:bg-slate-950 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff09_1px,transparent_1px),linear-gradient(to_bottom,#ffffff09_1px,transparent_1px)] bg-[size:24px_24px]"
  >
    <!-- Header -->
    <section class="pt-16 pb-12 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <span
          class="inline-block px-4 py-1.5 mb-6 text-sm font-medium text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-900/30 rounded-full"
        >
          Legal
        </span>
        <h1
          class="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight"
        >
          Privacy Policy
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-400">
          Your privacy matters to us. Learn how we collect, use, and protect
          your information.
        </p>
      </div>
    </section>

    <!-- Content -->
    <section class="pb-20 px-4">
      <div class="max-w-4xl mx-auto">
        <div
          class="bg-white dark:bg-[#1a1a1a] rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 p-8 md:p-12"
        >
          <!-- Table of Contents -->
          <nav class="mb-10 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
            <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Contents
            </h2>
            <ul class="space-y-2 text-sm">
              <li>
                <a
                  href="#overview"
                  class="text-cyan-600 dark:text-cyan-400 hover:underline"
                  >1. Overview & Scope</a
                >
              </li>
              <li>
                <a
                  href="#data-collected"
                  class="text-cyan-600 dark:text-cyan-400 hover:underline"
                  >2. Data We Collect</a
                >
              </li>
              <li>
                <a
                  href="#data-usage"
                  class="text-cyan-600 dark:text-cyan-400 hover:underline"
                  >3. How We Use Your Data</a
                >
              </li>
              <li>
                <a
                  href="#cookies"
                  class="text-cyan-600 dark:text-cyan-400 hover:underline"
                  >4. Cookies & Tracking</a
                >
              </li>
              <li>
                <a
                  href="#third-party"
                  class="text-cyan-600 dark:text-cyan-400 hover:underline"
                  >5. Third-Party Services</a
                >
              </li>
              <li>
                <a
                  href="#retention"
                  class="text-cyan-600 dark:text-cyan-400 hover:underline"
                  >6. Data Retention</a
                >
              </li>
              <li>
                <a
                  href="#security"
                  class="text-cyan-600 dark:text-cyan-400 hover:underline"
                  >7. Security Measures</a
                >
              </li>
              <li>
                <a
                  href="#rights"
                  class="text-cyan-600 dark:text-cyan-400 hover:underline"
                  >8. Your Rights</a
                >
              </li>
              <li>
                <a
                  href="#international"
                  class="text-cyan-600 dark:text-cyan-400 hover:underline"
                  >9. International Data Transfers</a
                >
              </li>
              <li>
                <a
                  href="#children"
                  class="text-cyan-600 dark:text-cyan-400 hover:underline"
                  >10. Children's Privacy</a
                >
              </li>
              <li>
                <a
                  href="#updates"
                  class="text-cyan-600 dark:text-cyan-400 hover:underline"
                  >11. Updates to This Policy</a
                >
              </li>
              <li>
                <a
                  href="#contact"
                  class="text-cyan-600 dark:text-cyan-400 hover:underline"
                  >12. Contact Us</a
                >
              </li>
            </ul>
          </nav>

          <!-- Sections -->
          <div class="prose prose-gray dark:prose-invert max-w-none">
            <!-- 1. Overview & Scope -->
            <section id="overview" class="mb-10">
              <h2
                class="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"
              >
                <span
                  class="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 text-sm font-bold"
                  >1</span
                >
                Overview & Scope
              </h2>
              <p class="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                This Privacy Policy explains how 3ssila AI ("we," "us," or
                "our") collects, uses, shares, and protects your personal
                information when you use our AI-powered translation and
                summarization platform.
              </p>
              <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
                By accessing or using 3ssila AI, you agree to the terms outlined
                in this Privacy Policy. This policy applies to all users of our
                website and services, including registered users and visitors.
              </p>
            </section>

            <!-- 2. Data We Collect -->
            <section id="data-collected" class="mb-10">
              <h2
                class="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"
              >
                <span
                  class="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 text-sm font-bold"
                  >2</span
                >
                Data We Collect
              </h2>
              <p class="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                We collect different types of information depending on how you
                interact with our platform:
              </p>

              <h3
                class="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3"
              >
                Information You Provide
              </h3>
              <ul
                class="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2"
              >
                <li>
                  <strong>Account Information:</strong> When you create an
                  account, we collect your name, email address, and password.
                </li>
                <li>
                  <strong>Content Data:</strong> Text you submit for translation
                  or summarization. This content is processed by our AI systems
                  to deliver results.
                </li>
                <li>
                  <strong>Communication Data:</strong> Information you provide
                  when contacting us for support or feedback.
                </li>
              </ul>

              <h3
                class="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3"
              >
                Information Collected Automatically
              </h3>
              <ul
                class="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2"
              >
                <li>
                  <strong>Usage Data:</strong> Information about how you use our
                  platform, including features accessed and actions taken.
                </li>
                <li>
                  <strong>Device Information:</strong> Browser type, operating
                  system, and device identifiers.
                </li>
                <li>
                  <strong>Log Data:</strong> IP address, access times, and
                  referring URLs.
                </li>
              </ul>
            </section>

            <!-- 3. How We Use Your Data -->
            <section id="data-usage" class="mb-10">
              <h2
                class="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"
              >
                <span
                  class="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 text-sm font-bold"
                  >3</span
                >
                How We Use Your Data
              </h2>
              <p class="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                We use your information for the following purposes:
              </p>
              <ul
                class="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2"
              >
                <li>
                  <strong>Service Delivery:</strong> To provide translation and
                  summarization services.
                </li>
                <li>
                  <strong>Account Management:</strong> To create, maintain, and
                  secure your account.
                </li>
                <li>
                  <strong>History Feature:</strong> To store your
                  translation/summarization history for registered users.
                </li>
                <li>
                  <strong>Service Improvement:</strong> To analyze usage
                  patterns and improve our platform.
                </li>
                <li>
                  <strong>Communication:</strong> To respond to inquiries and
                  send important service updates.
                </li>
                <li>
                  <strong>Security:</strong> To detect and prevent fraud, abuse,
                  and security threats.
                </li>
              </ul>
            </section>

            <!-- 4. Cookies & Tracking -->
            <section id="cookies" class="mb-10">
              <h2
                class="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"
              >
                <span
                  class="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 text-sm font-bold"
                  >4</span
                >
                Cookies & Tracking
              </h2>
              <p class="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                We use cookies and similar technologies to enhance your
                experience:
              </p>
              <ul
                class="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2"
              >
                <li>
                  <strong>Essential Cookies:</strong> Required for core
                  functionality like authentication and session management.
                </li>
                <li>
                  <strong>Preference Cookies:</strong> Store your settings such
                  as theme preferences (light/dark mode) and language
                  selections.
                </li>
                <li>
                  <strong>Analytics Cookies:</strong> Help us understand how
                  users interact with our platform to improve services.
                </li>
              </ul>
              <p class="text-gray-600 dark:text-gray-400 leading-relaxed mt-4">
                You can manage cookie preferences through your browser settings.
                Note that disabling certain cookies may affect platform
                functionality.
              </p>
            </section>

            <!-- 5. Third-Party Services -->
            <section id="third-party" class="mb-10">
              <h2
                class="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"
              >
                <span
                  class="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 text-sm font-bold"
                  >5</span
                >
                Third-Party Services
              </h2>
              <p class="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                To provide our services, we may share data with trusted
                third-party providers:
              </p>
              <ul
                class="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2"
              >
                <li>
                  <strong>AI Processing:</strong> Text content is processed
                  through AI language models to deliver translation and
                  summarization results.
                </li>
                <li>
                  <strong>Hosting Services:</strong> Our platform is hosted on
                  secure cloud infrastructure.
                </li>
                <li>
                  <strong>Authentication:</strong> Secure user authentication
                  and session management services.
                </li>
              </ul>
              <p class="text-gray-600 dark:text-gray-400 leading-relaxed mt-4">
                We require all third-party providers to maintain appropriate
                security measures and process data only as instructed by us.
              </p>
            </section>

            <!-- 6. Data Retention -->
            <section id="retention" class="mb-10">
              <h2
                class="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"
              >
                <span
                  class="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 text-sm font-bold"
                  >6</span
                >
                Data Retention
              </h2>
              <p class="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                We retain your data only as long as necessary to provide our
                services and fulfill legal obligations:
              </p>
              <ul
                class="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2"
              >
                <li>
                  <strong>Account Data:</strong> Retained while your account is
                  active. Deleted upon account termination request.
                </li>
                <li>
                  <strong>History Data:</strong> Your translation and
                  summarization history is stored while your account is active.
                </li>
                <li>
                  <strong>Guest Usage:</strong> For non-registered users, text
                  submitted for processing is not stored after the session ends.
                </li>
                <li>
                  <strong>Log Data:</strong> Retained for a limited period for
                  security and troubleshooting purposes.
                </li>
              </ul>
            </section>

            <!-- 7. Security Measures -->
            <section id="security" class="mb-10">
              <h2
                class="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"
              >
                <span
                  class="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 text-sm font-bold"
                  >7</span
                >
                Security Measures
              </h2>
              <p class="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                We implement industry-standard security measures to protect your
                data:
              </p>
              <ul
                class="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2"
              >
                <li>Encrypted data transmission using HTTPS/TLS protocols</li>
                <li>Secure password hashing and storage</li>
                <li>Regular security assessments and updates</li>
                <li>
                  Access controls limiting data access to authorized personnel
                </li>
                <li>Secure authentication using JWT tokens</li>
              </ul>
              <p class="text-gray-600 dark:text-gray-400 leading-relaxed mt-4">
                While we strive to protect your information, no method of
                transmission over the internet is 100% secure. We encourage you
                to use strong passwords and keep your credentials confidential.
              </p>
            </section>

            <!-- 8. Your Rights -->
            <section id="rights" class="mb-10">
              <h2
                class="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"
              >
                <span
                  class="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 text-sm font-bold"
                  >8</span
                >
                Your Rights
              </h2>
              <p class="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                Depending on your location, you may have certain rights
                regarding your personal data:
              </p>
              <ul
                class="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2"
              >
                <li>
                  <strong>Access:</strong> Request a copy of your personal data
                  we hold.
                </li>
                <li>
                  <strong>Correction:</strong> Request correction of inaccurate
                  or incomplete data.
                </li>
                <li>
                  <strong>Deletion:</strong> Request deletion of your personal
                  data (subject to legal requirements).
                </li>
                <li>
                  <strong>Data Portability:</strong> Request your data in a
                  structured, machine-readable format.
                </li>
                <li>
                  <strong>Withdraw Consent:</strong> Withdraw consent for data
                  processing where applicable.
                </li>
                <li>
                  <strong>Object:</strong> Object to certain types of data
                  processing.
                </li>
              </ul>
              <p class="text-gray-600 dark:text-gray-400 leading-relaxed mt-4">
                To exercise these rights, please contact us using the
                information provided below. We will respond to your request
                within a reasonable timeframe.
              </p>
            </section>

            <!-- 9. International Data Transfers -->
            <section id="international" class="mb-10">
              <h2
                class="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"
              >
                <span
                  class="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 text-sm font-bold"
                  >9</span
                >
                International Data Transfers
              </h2>
              <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
                Your data may be processed in countries other than your country
                of residence. When we transfer data internationally, we ensure
                appropriate safeguards are in place to protect your information
                in accordance with applicable data protection laws.
              </p>
            </section>

            <!-- 10. Children's Privacy -->
            <section id="children" class="mb-10">
              <h2
                class="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"
              >
                <span
                  class="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 text-sm font-bold"
                  >10</span
                >
                Children's Privacy
              </h2>
              <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
                3ssila AI is not intended for children under the age of 13 (or
                the applicable age in your jurisdiction). We do not knowingly
                collect personal information from children. If you believe we
                have inadvertently collected data from a child, please contact
                us immediately, and we will take steps to delete such
                information.
              </p>
            </section>

            <!-- 11. Updates to This Policy -->
            <section id="updates" class="mb-10">
              <h2
                class="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"
              >
                <span
                  class="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 text-sm font-bold"
                  >11</span
                >
                Updates to This Policy
              </h2>
              <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
                We may update this Privacy Policy from time to time to reflect
                changes in our practices or legal requirements. We will notify
                you of any material changes by posting the updated policy on our
                platform with a new effective date. We encourage you to review
                this policy periodically.
              </p>
            </section>

            <!-- 12. Contact Us -->
            <section id="contact" class="mb-10">
              <h2
                class="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"
              >
                <span
                  class="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 text-sm font-bold"
                  >12</span
                >
                Contact Us
              </h2>
              <p class="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                If you have any questions, concerns, or requests regarding this
                Privacy Policy or our data practices, please contact us:
              </p>
              <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
                <p class="text-gray-900 dark:text-white font-semibold mb-2">
                  3ssila AI
                </p>
                <p class="text-gray-600 dark:text-gray-400">
                  Email:
                  <a
                    href="mailto:khoudenak@gmail.com"
                    class="text-cyan-600 dark:text-cyan-400 hover:underline"
                    >khoudenak@gmail.com</a
                  >
                </p>
              </div>
            </section>

            <!-- Effective Date -->
            <div
              class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700"
            >
              <p class="text-gray-500 dark:text-gray-500 text-sm text-center">
                <strong>Effective Date:</strong> January 1, 2026
              </p>
            </div>
          </div>

          <!-- Back to Home -->
          <div class="mt-10 text-center">
            <RouterLink
              to="/"
              class="inline-flex items-center gap-2 text-cyan-600 dark:text-cyan-400 hover:underline font-medium"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Home
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Smooth scroll for anchor links */
html {
  scroll-behavior: smooth;
}

/* Animation */
section {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
