document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".main-nav a");
  const navToggle = document.querySelector(".nav-toggle");
  const mainNav = document.querySelector(".main-nav");
  const sections = document.querySelectorAll("main section");
  const policyField = document.getElementById("policy");
  const form = document.getElementById("lead-form");
  const successMessage = document.querySelector(".success-message");
  const modal = document.getElementById("policy-modal");
  const modalTitle = modal.querySelector(".modal-title");
  const modalDescription = modal.querySelector(".modal-description");
  const modalBenefits = modal.querySelector(".modal-benefits");
  const modalEligibility = modal.querySelector(".modal-eligibility");
  const modalClose = modal.querySelector(".modal-close");
  const modalDownload = document.getElementById("modal-download");
  const modalInterested = document.getElementById("modal-interested");

  const policyDetails = {
    term: {
      title: "Term Plans",
      description: "Term insurance offers high-value protection for your family during the years they need it most.",
      benefits: [
        "Large life cover at an affordable premium",
        "Financial protection for dependents",
        "Flexible policy term and sum assured options"
      ],
      eligibility: "Available for individuals aged 18 to 65. Ideal for salaried professionals and family providers."
    },
    savings: {
      title: "Savings Plans",
      description: "Build a disciplined savings habit while maintaining protection through a plan designed for long-term goals.",
      benefits: [
        "Regular returns with insurance cover",
        "Loyalty bonuses and maturity benefits",
        "Helps meet future goals with disciplined savings"
      ],
      eligibility: "Suitable for individuals looking for life cover plus savings. Recommended for age 25 to 55."
    },
    children: {
      title: "Children Plans",
      description: "Protect your child’s future with a plan that supports education, milestones, and long-term security.",
      benefits: [
        "Funding for education and milestones",
        "Growth with guaranteed benefits",
        "Security even in the event of a guardian’s loss"
      ],
      eligibility: "Designed for parents and guardians. Covers children from birth through early adulthood."
    },
    retirement: {
      title: "Retirement Plans",
      description: "Plan for a comfortable retirement with a strategy that creates future income and preserves your lifestyle.",
      benefits: [
        "Steady retirement income",
        "Tax-efficient savings",
        "Financial independence in later years"
      ],
      eligibility: "Ideal for individuals aged 30 to 55 who want to secure their retirement lifestyle."
    }
  };

  const setActiveLink = (id) => {
    navLinks.forEach((link) => {
      const linkTarget = link.getAttribute("href").substring(1);
      link.classList.toggle("active", linkTarget === id);
    });
  };

  const updateActiveLinkOnScroll = () => {
    const scrollPosition = window.scrollY + 150;
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        setActiveLink(sectionId);
      }
    });
  };

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const targetId = link.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
        setActiveLink(targetId);
      }
      if (mainNav.classList.contains("open")) {
        mainNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  });

  navToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768 && mainNav.classList.contains("open")) {
      mainNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  const openModal = (policyKey) => {
    const policy = policyDetails[policyKey];
    if (!policy) return;
    modalTitle.textContent = policy.title;
    modalDescription.textContent = policy.description;
    modalBenefits.innerHTML = policy.benefits.map((item) => `<li>${item}</li>`).join("");
    modalEligibility.textContent = policy.eligibility;
    policyField.value = policy.title;
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
  };

  const closeModal = () => {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
  };

  document.querySelectorAll(".view-details").forEach((button) => {
    button.addEventListener("click", () => openModal(button.dataset.policy));
  });

  document.querySelectorAll(".download-brochure").forEach((button) => {
    button.addEventListener("click", () => {
      openModal(button.dataset.policy);
    });
  });

  modalClose.addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  modalDownload.addEventListener("click", () => {
    window.open("brochure.html", "_blank");
  });

  modalInterested.addEventListener("click", () => {
    closeModal();
    document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) {
      return;
    }
    successMessage.classList.remove("hidden");
    successMessage.textContent = "Thank you, your request has been submitted successfully.";
    form.reset();
    policyField.value = "";
    setTimeout(() => {
      successMessage.classList.add("hidden");
    }, 6000);
  });

  window.addEventListener("scroll", updateActiveLinkOnScroll);
  updateActiveLinkOnScroll();
});
