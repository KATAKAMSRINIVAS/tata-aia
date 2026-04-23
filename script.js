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
  const modalStatus = document.getElementById("modal-status");
  const submissionSpinner = document.getElementById("submission-spinner");
  const submissionMessage = document.getElementById("submission-message");
  const nameField = document.getElementById("name");
  const emailField = document.getElementById("email");
  const phoneField = document.getElementById("phone");
  const formStatus = document.getElementById("form-status");
  const formSpinner = document.getElementById("form-spinner");
  const formMessage = document.getElementById("form-message");

  const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  let activePolicyKey = null;

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
    activePolicyKey = policyKey;
    modalTitle.textContent = policy.title;
    modalDescription.textContent = policy.description;
    modalBenefits.innerHTML = policy.benefits.map((item) => `<li>${item}</li>`).join("");
    modalEligibility.textContent = policy.eligibility;
    policyField.value = policy.title;
    modalStatus.classList.add("hidden");
    submissionSpinner.classList.add("hidden");
    submissionMessage.textContent = "";
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
  };

  const closeModal = () => {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    modalStatus.classList.add("hidden");
    submissionSpinner.classList.add("hidden");
    submissionMessage.textContent = "";
    activePolicyKey = null;
  };

  const setModalLoading = (isLoading) => {
    submissionSpinner.classList.toggle("hidden", !isLoading);
    modalDownload.disabled = isLoading;
    modalInterested.disabled = isLoading;

    if (isLoading) {
      submissionMessage.textContent = "Submitting policy request...";
      submissionMessage.classList.remove("error");
      modalStatus.classList.remove("hidden");
    }
  };

  const showModalFeedback = (message, isError = false) => {
    submissionSpinner.classList.add("hidden");
    modalStatus.classList.remove("hidden");
    submissionMessage.textContent = message;
    submissionMessage.classList.toggle("error", isError);
    modalDownload.disabled = false;
    modalInterested.disabled = false;
  };

  const clearFormFields = () => {
    form.reset();
    policyField.value = "";
  };

  const downloadPolicyPdf = async (policyName) => {
    const response = await fetch(`${BACKEND_URL}/api/policy-pdf/download`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: policyName })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to download PDF: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const { pdf_url, download_count } = await response.json();
    if (!pdf_url) {
      throw new Error("No PDF URL returned from the backend route.");
    }

    return { pdf_url, download_count };
  };

  const setFormLoading = (isLoading) => {
    formSpinner.classList.toggle("hidden", !isLoading);
    form.querySelector(".submit-button").disabled = isLoading;

    if (isLoading) {
      formMessage.textContent = "Submitting lead...";
      formMessage.classList.remove("error");
      formStatus.classList.remove("hidden");
    }
  };

  const formatSupabaseError = (error) => {
    const rawMessage = error?.message || String(error || "Unknown error");
    if (rawMessage.includes("Could not find the 'full_name' column")) {
      return "Lead submission failed: Supabase table schema mismatch. The 'policy_leads' table does not contain the expected 'full_name' column.";
    }
    if (rawMessage.includes("Could not find the 'email' column")) {
      return "Lead submission failed: Supabase table schema mismatch. The 'policy_leads' table does not contain the expected 'email' column.";
    }
    if (rawMessage.includes("Could not find the 'phone' column")) {
      return "Lead submission failed: Supabase table schema mismatch. The 'policy_leads' table does not contain the expected 'phone' column.";
    }
    if (rawMessage.includes("Could not find the 'policy_selected' column")) {
      return "Lead submission failed: Supabase table schema mismatch. The 'policy_leads' table does not contain the expected 'policy_selected' column.";
    }
    if (rawMessage.includes("schema cache")) {
      return "Lead submission failed: Supabase schema cache error. Please check your table columns and refresh the Supabase schema.";
    }
    return rawMessage;
  };

  const showFormFeedback = (message, isError = false) => {
    formSpinner.classList.add("hidden");
    formStatus.classList.remove("hidden");
    formMessage.textContent = message;
    formMessage.classList.toggle("error", isError);
    form.querySelector(".submit-button").disabled = false;
  };

  const submitLead = async () => {
    const payload = {
      category_id: null,
      category_name: policyField.value,
      full_name: nameField.value.trim(),
      email: emailField.value.trim(),
      phone: phoneField.value.trim(),
      policy_selected: policyField.value,
      message: "Interested in this policy",
      status: "new",
      source_page: window.location.href,
      created_at: new Date().toISOString()
    };

    const response = await fetch(`${SUPABASE_URL}/rest/v1/policy_leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Prefer: "return=representation"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      let errorMessage = `Lead submission failed: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData?.message) {
          errorMessage = errorData.message;
        }
      } catch (_e) {
        // ignore JSON parse errors
      }
      throw new Error(errorMessage);
    }

    return await response.json();
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

  modalDownload.addEventListener("click", async () => {
    if (!activePolicyKey) {
      showModalFeedback("Please open a policy before downloading the brochure.", true);
      return;
    }

    try {
      const policyTitle = policyDetails[activePolicyKey]?.title || "";
      setModalLoading(true);
      const { pdf_url, download_count } = await downloadPolicyPdf(policyTitle);
      const downloadFilename = "policy-brochure.pdf"; // Assuming it's a PDF
      const anchor = document.createElement("a");
      anchor.href = pdf_url;
      anchor.download = downloadFilename;
      anchor.target = "_blank";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      showModalFeedback(`Brochure downloaded! (Total downloads: ${download_count})`);
    } catch (error) {
      console.error("PDF download error:", error);
      showModalFeedback(`Download failed: ${error.message}`, true);
    } finally {
      setModalLoading(false);
    }
  });

  modalInterested.addEventListener("click", () => {
    closeModal();
    document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) {
      return;
    }

    try {
      setFormLoading(true);
      await submitLead();
      showFormFeedback("Thank you! Your lead has been submitted successfully.");
      form.reset();
      policyField.value = "";
    } catch (error) {
      console.error("Supabase lead submission error:", error);
      showFormFeedback(`Submission failed: ${formatSupabaseError(error)}`, true);
    } finally {
      setFormLoading(false);
    }
  });

  window.addEventListener("scroll", updateActiveLinkOnScroll);
  updateActiveLinkOnScroll();
});
