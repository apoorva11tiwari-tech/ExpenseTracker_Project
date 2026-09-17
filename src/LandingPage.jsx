import React from "react";
import { Link } from "react-router-dom";

import {
  ArrowRight,
  CheckCircle,
  Star,
  Shield,
  Target,
  BarChart2,
  Bell,
  Lock,
  Zap,
  PieChart,
} from "lucide-react";

/* =========================================================
   DATA
========================================================= */

const features = [
  {
    icon: Shield,
    title: "Bank-Grade Security",
    description:
      "256-bit encryption and two-factor authentication keep your financial data protected.",
    color: "feature-purple",
  },
  {
    icon: BarChart2,
    title: "Smart Analytics",
    description:
      "Understand your spending with clear charts and intelligent financial insights.",
    color: "feature-blue",
  },
  {
    icon: Target,
    title: "Budget Goals",
    description:
      "Set realistic budgets and track your progress without the complexity.",
    color: "feature-green",
  },
  {
    icon: Lock,
    title: "Private by Default",
    description:
      "Your financial information stays private. We never sell your personal data.",
    color: "feature-yellow",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description:
      "Get helpful notifications when you're close to your budget limits.",
    color: "feature-pink",
  },
  {
    icon: Zap,
    title: "Savings Goals",
    description:
      "Build better saving habits with simple goals and progress tracking.",
    color: "feature-orange",
  },
];

const steps = [
  {
    number: "01",
    title: "Sign Up Securely",
    description:
      "Create your account in seconds with secure authentication.",
  },
  {
    number: "02",
    title: "Log Transactions",
    description:
      "Easily record your income and expenses.",
  },
  {
    number: "03",
    title: "Set Budgets",
    description:
      "Create spending limits that work for your lifestyle.",
  },
  {
    number: "04",
    title: "Grow Smarter",
    description:
      "Use insights to improve your financial habits.",
  },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "MCA Student, Delhi",
    text:
      "CashMate helped me understand exactly where my money was going. I finally feel in control of my spending.",
  },
  {
    name: "Arjun Mehta",
    role: "Software Engineer, Bengaluru",
    text:
      "The dashboard is simple and the insights are actually useful. I check it every day now.",
  },
  {
    name: "Sneha Reddy",
    role: "MBA Student, Hyderabad",
    text:
      "I love how easy it is to set budgets and track my progress. CashMate makes managing money feel effortless.",
  },
];

const trustPoints = [
  "256-bit AES encryption",
  "Two-factor authentication",
  "Zero data selling policy",
  "SOC 2 compliant",
];

const dashboardCards = [
  {
    title: "Balance",
    amount: "₹12,550",
    className: "balance-card",
  },
  {
    title: "Income",
    amount: "₹35,000",
    className: "income-card",
  },
  {
    title: "Expenses",
    amount: "₹22,450",
    className: "expense-card",
  },
  {
    title: "Budget Left",
    amount: "₹2,550",
    className: "budget-card",
  },
];

const categories = [
  {
    name: "Food",
    percentage: 35,
    className: "category-food",
  },
  {
    name: "Shopping",
    percentage: 25,
    className: "category-shopping",
  },
  {
    name: "Transport",
    percentage: 15,
    className: "category-transport",
  },
  {
    name: "Bills",
    percentage: 25,
    className: "category-bills",
  },
];

const spendingBars = [40, 65, 50, 80, 55, 70, 45];

const securityPoints = [
  "Your data is encrypted",
  "Secure authentication",
  "No selling of personal data",
  "Privacy-focused design",
];

const stats = [
  {
    // value: "12,000+",
    label: "Active Users",
  },
  {
    // value: "2.4M+",
    label: "Transactions",
  },
  {
    // value: "₹6,200",
    label: "Avg. Savings",
  },
  {
    // value: "4.9 / 5",
    label: "User Rating",
  },
];


/* =========================================================
   LANDING PAGE
========================================================= */

function Landing() {
  return (
    <div className="landing-page">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav className="navbar navbar-expand-lg navbar-light fixed-top cashmate-navbar">

        <div className="container">

          {/* Logo */}

          <Link
            to="/"
            className="navbar-brand d-flex align-items-center gap-2"
          >

            <div className="logo-icon">
              <PieChart
                size={22}
                strokeWidth={2.5}
              />
            </div>

            <span className="logo-text">
              Cash<span>Mate</span>
            </span>

          </Link>


          {/* Desktop Navigation */}

          <div className="d-none d-md-flex align-items-center gap-4 ms-auto">

            <a
              href="#features"
              className="nav-link-custom"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="nav-link-custom"
            >
              How it Works
            </a>

            <a
              href="#reviews"
              className="nav-link-custom"
            >
              Reviews
            </a>

            <Link
              to="/login"
              className="login-link"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="btn btn-primary-custom"
            >
              Get Started
            </Link>

          </div>

        </div>

      </nav>


      {/* =====================================================
          HERO SECTION
      ===================================================== */}

      <section className="hero-section">

        {/* Background decorations */}

        <div className="hero-blob hero-blob-one"></div>

        <div className="hero-blob hero-blob-two"></div>

        <div className="ambient-dots"></div>


        <div className="container position-relative">

          <div className="row align-items-center g-5">

            {/* =================================================
                HERO LEFT
            ================================================= */}

            <div className="col-lg-6">

              {/* Security badge */}

              <div className="trust-badge mb-4">

                <span className="security-dot">
                  🔒
                </span>

                <span>
                  Secured · Bank-Grade Encryption
                </span>

              </div>


              {/* Main heading */}

              <h1 className="hero-title">

                Your Money.

                <br />

                <span className="gradient-text">
                  Secured. Simplified.
                </span>

              </h1>


              {/* Description */}

              <p className="hero-description">

                Take control of your finances with CashMate.
                Track expenses, manage budgets, understand your
                spending, and build better financial habits —
                all from one simple dashboard.

              </p>


              {/* Buttons */}

              <div className="hero-buttons d-flex flex-wrap gap-3">

                <Link
                  to="/signup"
                  className="btn btn-primary-custom btn-lg"
                >

                  Start for Free

                  <ArrowRight size={18} />

                </Link>


                <Link
                  to="/login"
                  className="btn btn-outline-custom btn-lg"
                >

                  Sign In Securely

                </Link>

              </div>


              {/* Trust information */}

              <div className="hero-trust-row mt-4">

                <div>

                  <CheckCircle size={17} />

                  <span>
                    No credit card required
                  </span>

                </div>


                <div>

                  <CheckCircle size={17} />

                  <span>
                    Free to start
                  </span>

                </div>

              </div>

            </div>


            {/* =================================================
                HERO RIGHT - DASHBOARD
            ================================================= */}

            <div className="col-lg-6">

              <div className="dashboard-wrapper animate-float">

                <div className="dashboard-window">

                  {/* Browser top bar */}

                  <div className="browser-header">

                    <div className="browser-dots">

                      <span></span>
                      <span></span>
                      <span></span>

                    </div>


                    <div className="browser-url">

                      cashmate.app/dashboard

                    </div>

                  </div>


                  {/* Dashboard content */}

                  <div className="dashboard-content">


                    {/* Dashboard heading */}

                    <div className="d-flex justify-content-between align-items-center mb-3">

                      <div>

                        <h5 className="dashboard-heading mb-1">
                          Overview
                        </h5>

                        <small className="text-muted">
                          Your financial summary
                        </small>

                      </div>


                      <div className="dashboard-avatar">
                        A
                      </div>

                    </div>


                    {/* =================================================
                        DASHBOARD STAT CARDS
                    ================================================= */}

                    <div className="row g-2 mb-3">

                      {dashboardCards.map((card, index) => (

                        <div
                          className="col-6 col-xl-3"
                          key={index}
                        >

                          <div
                            className={`dashboard-stat-card ${card.className}`}
                          >

                            <small>
                              {card.title}
                            </small>

                            <strong>
                              {card.amount}
                            </strong>

                          </div>

                        </div>

                      ))}

                    </div>


                    {/* =================================================
                        DASHBOARD CHARTS
                    ================================================= */}

                    <div className="row g-3">


                      {/* Spending Trend */}

                      <div className="col-md-7">

                        <div className="chart-card">

                          <div className="d-flex justify-content-between mb-3">

                            <div>

                              <h6 className="mb-1">
                                Spending Trend
                              </h6>

                              <small className="text-muted">
                                Last 7 days
                              </small>

                            </div>


                            <BarChart2 size={18} />

                          </div>


                          <div className="bars-container">

                            {spendingBars.map(
                              (height, index) => (

                                <div
                                  className="spending-bar-wrapper"
                                  key={index}
                                >

                                  <div
                                    className="spending-bar"
                                    style={{
                                      height: `${height}%`,
                                    }}
                                  ></div>

                                </div>

                              )
                            )}

                          </div>

                        </div>

                      </div>


                      {/* Categories */}

                      <div className="col-md-5">

                        <div className="chart-card">

                          <div className="d-flex justify-content-between align-items-center mb-3">

                            <h6 className="mb-0">
                              Categories
                            </h6>

                            <PieChart size={18} />

                          </div>


                          {categories.map(
                            (category, index) => (

                              <div
                                className="category-row"
                                key={index}
                              >

                                <div className="category-info">

                                  <span
                                    className={`category-dot ${category.className}`}
                                  ></span>

                                  <span>
                                    {category.name}
                                  </span>

                                </div>


                                <strong>
                                  {category.percentage}%
                                </strong>

                              </div>

                            )
                          )}

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          FEATURES SECTION
      ===================================================== */}

      <section
        id="features"
        className="section-padding features-section"
      >

        <div className="container">


          {/* Section heading */}

          <div className="section-heading text-center">

            <span className="section-label">
              WHY CASHMATE
            </span>

            <h2>

              Everything you need to manage

              <span className="gradient-text">
                {" "}your money
              </span>

            </h2>

            <p>

              Simple tools designed to help you understand
              your finances and make smarter decisions.

            </p>

          </div>


          {/* Feature cards */}

          <div className="row g-4 mt-4">

            {features.map((feature, index) => {

              const Icon = feature.icon;

              return (

                <div
                  className="col-md-6 col-lg-4"
                  key={index}
                >

                  <div className="feature-card">


                    {/* Icon */}

                    <div
                      className={`feature-icon ${feature.color}`}
                    >

                      <Icon size={24} />

                    </div>


                    {/* Title */}

                    <h4>
                      {feature.title}
                    </h4>


                    {/* Description */}

                    <p>
                      {feature.description}
                    </p>

                  </div>

                </div>

              );

            })}

          </div>

        </div>

      </section>


      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}

      <section
        id="how-it-works"
        className="how-section section-padding"
      >

        <div className="container">


          {/* Heading */}

          <div className="section-heading text-center light-heading">

            <span className="section-label">
              HOW IT WORKS
            </span>

            <h2>

              Start managing your money

              <span className="gradient-text">
                {" "}in minutes
              </span>

            </h2>

            <p>
              Getting started with CashMate is simple.
            </p>

          </div>


          {/* Steps */}

          <div className="row g-4 mt-4">

            {steps.map((step, index) => (

              <div
                className="col-md-6 col-lg-3"
                key={index}
              >

                <div className="step-card">


                  {/* Number */}

                  <div className="step-number">
                    {step.number}
                  </div>


                  {/* Title */}

                  <h4>
                    {step.title}
                  </h4>


                  {/* Description */}

                  <p>
                    {step.description}
                  </p>


                  {/* Arrow */}

                  {index !== steps.length - 1 && (

                    <div className="step-arrow">
                      →
                    </div>

                  )}

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          SECURITY SECTION
      ===================================================== */}

      <section className="section-padding security-section">

        <div className="container">

          <div className="row align-items-center g-5">


            {/* LEFT - SECURITY */}

            <div className="col-lg-6">

              <span className="section-label">
                YOUR SECURITY MATTERS
              </span>


              <h2 className="security-title">

                Your financial data deserves

                <span className="gradient-text">
                  {" "}serious protection.
                </span>

              </h2>


              <p className="security-description">

                CashMate is designed with privacy and
                security at the center. Your information
                belongs to you.

              </p>


              {/* Security list */}

              <div className="security-list">

                {securityPoints.map(
                  (point, index) => (

                    <div
                      className="security-item"
                      key={index}
                    >

                      <div className="security-check">

                        <CheckCircle size={18} />

                      </div>

                      <span>
                        {point}
                      </span>

                    </div>

                  )
                )}

              </div>


              {/* Button */}

              <Link
                to="/signup"
                className="btn btn-primary-custom mt-3"
              >

                Get Started Free

                <ArrowRight size={18} />

              </Link>

            </div>


            {/* RIGHT - STATS */}

            <div className="col-lg-6">

              <div className="stats-box">

                <div className="row g-0">

                  {stats.map(
                    (stat, index) => (

                      <div
                        className="col-6"
                        key={index}
                      >

                        <div className="stat-item">

                          <h3>
                            {stat.value}
                          </h3>

                          <p>
                            {stat.label}
                          </p>

                        </div>

                      </div>

                    )
                  )}

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          TESTIMONIALS
      ===================================================== */}

      <section
        id="reviews"
        className="section-padding testimonials-section"
      >

        <div className="container">


          {/* Heading */}

          <div className="section-heading text-center">

            <span className="section-label">
              WHAT USERS SAY
            </span>

            <h2>

              Loved by people who want

              <span className="gradient-text">
                {" "}better finances
              </span>

            </h2>

            <p>

              See how CashMate is helping people
              understand and manage their money.

            </p>

          </div>


          {/* Testimonials */}

          <div className="row g-4 mt-4">

            {testimonials.map(
              (testimonial, index) => (

                <div
                  className="col-md-6 col-lg-4"
                  key={index}
                >

                  <div className="testimonial-card">


                    {/* Stars */}

                    <div className="stars">

                      {[1, 2, 3, 4, 5].map(
                        (star) => (

                          <Star
                            key={star}
                            size={17}
                            fill="currentColor"
                          />

                        )
                      )}

                    </div>


                    {/* Review */}

                    <p className="testimonial-text">

                      "{testimonial.text}"

                    </p>


                    {/* User */}

                    <div className="testimonial-user">

                      <div className="testimonial-avatar">

                        {testimonial.name.charAt(0)}

                      </div>


                      <div>

                        <strong>
                          {testimonial.name}
                        </strong>

                        <small>
                          {testimonial.role}
                        </small>

                      </div>

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        </div>

      </section>


      {/* =====================================================
          CALL TO ACTION
      ===================================================== */}

      <section className="cta-section">

        <div className="container">

          <div className="cta-box text-center">


            {/* Decorative circles */}

            <div className="cta-decoration cta-decoration-one"></div>

            <div className="cta-decoration cta-decoration-two"></div>


            <div className="position-relative">


              {/* Heading */}

              <h2>

                Take control of your

                <br />

                money today.

              </h2>


              {/* Description */}

              <p>

                Start building better financial habits
                with CashMate.

              </p>


              {/* CTA Button */}

              <Link
                to="/signup"
                className="btn btn-light btn-lg cta-button"
              >

                Create Free Account

                <ArrowRight size={18} />

              </Link>


              {/* Trust points */}

              <div className="cta-trust">

                {trustPoints.map(
                  (point, index) => (

                    <div key={index}>

                      <CheckCircle size={15} />

                      <span>
                        {point}
                      </span>

                    </div>

                  )
                )}

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="footer">

        <div className="container">

          <div className="row align-items-center g-4">


            {/* Footer logo */}

            <div className="col-md-6">

              <Link
                to="/"
                className="footer-logo"
              >

                <div className="logo-icon">

                  <PieChart size={20} />

                </div>

                <span>
                  CashMate
                </span>

              </Link>


              <p className="footer-description">

                Simple, secure and smart money management.

              </p>

            </div>


            {/* Footer links */}

            <div className="col-md-6">

              <div className="footer-links">

                <Link to="/login">
                  Login
                </Link>

                <Link to="/signup">
                  Sign Up
                </Link>

                <Link to="/admin/login">
                  Admin
                </Link>

              </div>

            </div>

          </div>


          <hr />


          {/* Copyright */}

          <div className="footer-bottom">

            <span>

              © {new Date().getFullYear()} CashMate.
              All rights reserved.

            </span>


            <span>

              Built for smarter financial habits.

            </span>

          </div>

        </div>

      </footer>

    </div>
  );
}

export default Landing;