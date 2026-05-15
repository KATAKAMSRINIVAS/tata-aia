document.addEventListener("DOMContentLoaded", () => {

  // ── Supabase client ──────────────────────────────────────────────────────────
  const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // ── DOM refs ─────────────────────────────────────────────────────────────────
  const navLinks       = document.querySelectorAll(".main-nav a");
  const navToggle      = document.querySelector(".nav-toggle");
  const mainNav        = document.querySelector(".main-nav");
  const sections       = document.querySelectorAll("main section");
  const policyField    = document.getElementById("policy");
  const form           = document.getElementById("lead-form");
  const successMessage = document.querySelector(".success-message");

  const policyTitles = {
    term:       "Term Plans",
    savings:    "Savings Plans",
    children:   "Children Plans",
    retirement: "Retirement Plans"
  };

  // ── Brochure content fallback (used when database unavailable) ──────────────
  const brochureDataFallback = {
    term: {
      title:       "Term Plans",
      about_plan:  "Term insurance offers high-value protection for your family during the years they need it most.",
      key_benefits: ["Large life cover at an affordable premium", "Financial protection for dependents", "Flexible policy term and sum assured options"],
      eligibility_details: "Available for individuals aged 18 to 65. Ideal for salaried professionals and family providers.",
      eligibility_notes: "",
      sample_plan_section_title: "Sample Plan Details",
      premium_details: "Premiums depend on age, sum assured, term, and product variant. Your advisor will walk through indicative options and tax implications before you decide.",
      plan_term_details: "Typical terms range from short protection windows to longer coverage periods; the right term matches your income years and family obligations.",
      maturity_details: "Pure term plans usually do not pay a maturity benefit—the focus is life protection for your nominees. Confirm product-specific wording with your advisor."
    },
    savings: {
      title:       "Savings Plans",
      about_plan:  "Build a disciplined savings habit while maintaining protection through a plan designed for long-term goals.",
      key_benefits: ["Regular returns with insurance cover", "Loyalty bonuses and maturity benefits", "Helps meet future goals with disciplined savings"],
      eligibility_details: "Suitable for individuals aged 25 to 55 looking for life cover plus savings.",
      eligibility_notes: "",
      sample_plan_section_title: "Sample Plan Details",
      premium_details: "Premium payment modes (annual, half-yearly, etc.) and amounts vary by age, premium payment term, and fund or bonus structure. Your advisor will explain options suited to your cash flow.",
      plan_term_details: "Policy terms often combine a premium payment period with a longer coverage or accumulation phase; align the term with when you need money back or continued protection.",
      maturity_details: "Savings-oriented plans may pay maturity or survival benefits as defined in the product; bonuses or returns are illustrative until confirmed in the official illustration."
    },
    children: {
      title:       "Children Plans",
      about_plan:  "Protect your child's future with a plan that supports education, milestones, and long-term security.",
      key_benefits: ["Funding for education and milestones", "Guaranteed growth with maturity benefits", "Security even in the event of a guardian's loss"],
      eligibility_details: "Designed for parents and guardians. Covers children from birth through early adulthood.",
      eligibility_notes: "",
      sample_plan_section_title: "Sample Plan Details",
      premium_details: "Premiums are set based on the life assured's age, sum assured, and how long you pay—your advisor will share indicative figures for education or milestone goals.",
      plan_term_details: "Choose a term that covers school and higher education years; some designs link payouts to key ages so funds arrive when milestones occur.",
      maturity_details: "Benefits may include guaranteed or accrued amounts around maturity for the child's future needs; exact structure depends on the selected child plan—review the illustration carefully."
    },
    retirement: {
      title:       "Retirement Plans",
      about_plan:  "Plan for a comfortable retirement with a strategy that creates future income and preserves your lifestyle.",
      key_benefits: ["Steady retirement income", "Tax-efficient savings", "Financial independence in later years"],
      eligibility_details: "Ideal for individuals aged 30 to 55 who want to secure their retirement lifestyle.",
      eligibility_notes: "",
      sample_plan_section_title: "Sample Plan Details",
      premium_details: "Contribution amounts depend on entry age, deferment or payout preferences, and whether income starts immediately or later. Your advisor will align premium with your retirement timeline.",
      plan_term_details: "Deferment period and annuity or withdrawal phase define how long you accumulate versus how long income lasts—pick terms that match your retirement age and lifestyle.",
      maturity_details: "Payouts may be annuity income, lump sum, or a combination per product rules; tax treatment can vary—confirm maturity and income details with your advisor."
    }
  };

  // ── Fetch brochure data from Supabase ──────────────────────────────────────
  let brochureData = {};
  (async () => {
    try {
      const { data, error } = await sb
        .from("policy_categories")
        .select("category, about_plan, key_benefits, eligibility_details, eligibility_notes, sample_plan_section_title, premium_details, plan_term_details, maturity_details");

      if (!error && data && data.length > 0) {
        data.forEach(row => {
          brochureData[row.category] = {
            title: policyTitles[row.category] || "",
            about_plan: row.about_plan || brochureDataFallback[row.category]?.about_plan || "",
            key_benefits: Array.isArray(row.key_benefits) ? row.key_benefits : (brochureDataFallback[row.category]?.key_benefits || []),
            eligibility_details: row.eligibility_details || brochureDataFallback[row.category]?.eligibility_details || "",
            eligibility_notes: row.eligibility_notes || brochureDataFallback[row.category]?.eligibility_notes || "",
            sample_plan_section_title: row.sample_plan_section_title || "Sample Plan Details",
            premium_details: row.premium_details || brochureDataFallback[row.category]?.premium_details || "",
            plan_term_details: row.plan_term_details || brochureDataFallback[row.category]?.plan_term_details || "",
            maturity_details: row.maturity_details || brochureDataFallback[row.category]?.maturity_details || ""
          };
        });
      } else {
        brochureData = brochureDataFallback;
      }
    } catch (err) {
      console.warn("Could not fetch brochure data from Supabase:", err);
      brochureData = brochureDataFallback;
    }
  })();

  // ── Build a self-contained brochure HTML string ──────────────────────────────
  function buildBrochureHTML(slug) {
    const d = brochureData[slug];
    if (!d) return null;

    const benefitsList = Array.isArray(d.key_benefits) 
      ? d.key_benefits.map(b => `<li>${b}</li>`).join("")
      : (d.key_benefits || []).map(b => `<li>${b}</li>`).join("");

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${d.title} - TATA-AIA Insurance</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@700&display=swap');
    :root { --primary:#1E3A8A; --bg:#f8fafc; --muted:#475569; --card:#ffffff; --radius:20px; }
    *{box-sizing:border-box;}
    body{margin:0;padding:2rem;font-family:'Inter',sans-serif;background:var(--bg);color:#0f172a;line-height:1.8;word-wrap:break-word;}
    h1{font-family:'Playfair Display',serif;font-size:2.5rem;color:var(--primary);margin:0 0 0.25rem;}
    h2{font-family:'Playfair Display',serif;font-size:1.5rem;color:var(--primary);margin:1.5rem 0 0.5rem;}
    h3{font-family:'Playfair Display',serif;font-size:1.1rem;color:var(--primary);margin:1rem 0 0.5rem;}
    p,li{font-size:1rem;color:var(--muted);margin:0.5rem 0;}
    ul{padding-left:1.25rem;margin:0.5rem 0 1rem;}
    .section{background:var(--card);border-radius:var(--radius);padding:1.5rem;box-shadow:0 12px 30px rgba(15,23,42,0.08);margin-bottom:1.25rem;}
    .badge{display:inline-block;background:var(--primary);color:#fff;font-size:0.7rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;padding:0.3rem 0.85rem;border-radius:999px;margin-bottom:1rem;}
    .contact{margin-top:1.5rem;padding:1.25rem;background:rgba(30,58,138,0.07);border-radius:var(--radius);}
    .contact strong{display:block;color:var(--primary);margin-bottom:0.4rem;}
    .footer{margin-top:2rem;text-align:center;font-size:0.8rem;color:#94a3b8;}
    .subsection{margin:1.25rem 0;padding:1rem;background:rgba(30,58,138,0.04);border-left:4px solid var(--primary);border-radius:8px;}
    .subsection h3{margin-top:0;}
  </style>
</head>
<body>
  <div class="badge">TATA-AIA Insurance</div>
  <h1>${d.title}</h1>
  <p style="color:#64748b;margin:0 0 1.5rem;">Official Brochure &mdash; K. Srinivasa Rao, Advisor</p>

  <div class="section">
    <h2>About This Plan</h2>
    <p>${d.about_plan || ""}</p>
  </div>

  <div class="section">
    <h2>Key Benefits</h2>
    <ul>${benefitsList || "<li>For details, please consult your advisor.</li>"}</ul>
  </div>

  <div class="section">
    <h2>Eligibility Details</h2>
    <p>${d.eligibility_details || ""}</p>
    <div style="margin-top:1rem;padding:0.75rem;background:rgba(30,58,138,0.04);border-left:3px solid #1E3A8A;border-radius:6px;">
      <h3 style="margin-top:0;font-size:0.95rem;color:#1E3A8A;">Notes:</h3>
      <p style="margin-bottom:0;font-size:0.95rem;">${d.eligibility_notes || "No additional notes available."}</p>
    </div>

  <div class="section">
    <h2>${d.sample_plan_section_title || "Sample Plan Details"}</h2>
    <p style="font-style:italic;color:#64748b;margin-bottom:1rem;">Understand key aspects of this plan to make an informed decision.</p>
    
    <div class="subsection">
      <h3>What is the Premium?</h3>
      <p>${d.premium_details || "Contact your advisor for premium details."}</p>
    </div>

    <div class="subsection">
      <h3>Plan Term</h3>
      <p>${d.plan_term_details || "Contact your advisor for term details."}</p>
    </div>

    <div class="subsection">
      <h3>Maturity Details</h3>
      <p>${d.maturity_details || "Contact your advisor for maturity details."}</p>
    </div>
  </div>

  <div class="contact">
    <strong>Contact Your Advisor</strong>
    <p>K. Srinivasa Rao &mdash; TATA-AIA Insurance</p>
    <p>Email: katakam_srinivas@hotmail.com</p>
    <p>Phone: +91 9989631000</p>
  </div>

  <div class="footer">&copy; ${new Date().getFullYear()} TATA-AIA | Generated on ${new Date().toLocaleDateString("en-IN", {day:"2-digit",month:"long",year:"numeric"})}</div>

  <div style="display:flex;gap:1rem;flex-wrap:wrap;margin-top:2rem;">
    <button onclick="saveBrochure()" style="background:#1E3A8A;color:#fff;border:none;padding:0.75rem 1.75rem;border-radius:8px;font-size:1rem;cursor:pointer;font-family:'Inter',sans-serif;font-weight:600;transition:background 0.2s;" onmouseover="this.style.background='#1d4ed8'" onmouseout="this.style.background='#1E3A8A'">Save Brochure</button>
    <button onclick="window.close()" style="background:#fff;color:#1E3A8A;border:1.5px solid #1E3A8A;padding:0.75rem 1.75rem;border-radius:8px;font-size:1rem;cursor:pointer;font-family:'Inter',sans-serif;font-weight:600;transition:background 0.2s;" onmouseover="this.style.background='#eef2ff'" onmouseout="this.style.background='#fff'">Close Brochure</button>
  </div>

  <script>
    function saveBrochure() {
      const html = '<!DOCTYPE html>\\n' + document.documentElement.outerHTML;
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = '${slug}_brochure.html';
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(a.href);
      document.body.removeChild(a);
    }
  <\/script>
</body>
</html>`;
  }

  // ── Read ?policy= from URL ───────────────────────────────────────────────────
  const getSelectedPolicy = () => {
    const sp = new URLSearchParams(window.location.search);
    if (sp.has("policy")) return sp.get("policy");
    const hash = window.location.hash || "";
    const qi = hash.indexOf("?");
    if (qi !== -1) {
      const hp = new URLSearchParams(hash.substring(qi + 1));
      if (hp.has("policy")) return hp.get("policy");
    }
    return null;
  };

  const selectedPolicy = getSelectedPolicy();
  if (selectedPolicy && policyField) {
    policyField.value = policyTitles[selectedPolicy] || "";
  }

  // ── Nav scroll-spy ───────────────────────────────────────────────────────────
  const setActiveLink = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href").substring(1) === id);
    });
  };

  const updateActiveLinkOnScroll = () => {
    const scrollY = window.scrollY + 150;
    sections.forEach((section) => {
      if (scrollY >= section.offsetTop && scrollY < section.offsetTop + section.offsetHeight) {
        setActiveLink(section.getAttribute("id"));
      }
    });
  };

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href").substring(1);
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
      setActiveLink(targetId);
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

  window.addEventListener("scroll", updateActiveLinkOnScroll);
  updateActiveLinkOnScroll();

  // ── Book a Call ──────────────────────────────────────────────────────────────
  document.querySelector(".secondary-button")?.addEventListener("click", () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  });

  // ── View Details → open individual policy page ───────────────────────────────
  document.querySelectorAll(".view-details").forEach((btn) => {
    btn.addEventListener("click", () => {
      window.open(`${btn.dataset.policy}.html`, "_blank", "noopener,noreferrer");
    });
  });

  // ── Download Brochure → generate HTML in-memory and save as .html ────────────
  // Uses Blob — no fetch(), no server needed. Works from file:// and any host.
  document.querySelectorAll(".download-brochure").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const slug     = btn.dataset.policy;
      const filename = `${slug}_brochure.html`;
      const original = btn.textContent;

      btn.textContent = "Downloading…";
      btn.disabled    = true;

      try {
        const html = buildBrochureHTML(slug);
        if (!html) throw new Error("Unknown policy: " + slug);

        const blob = new Blob([html], { type: "text/html;charset=utf-8" });
        const url  = URL.createObjectURL(blob);

        const win = window.open(url, "_blank", "noopener,noreferrer");
        // Revoke after a short delay to give the new tab time to load
        setTimeout(() => URL.revokeObjectURL(url), 30000);

        // Increment download_count in Supabase (fire-and-forget)
        sb.from("policy_categories")
          .select("id, download_count")
          .eq("category", slug)
          .single()
          .then(({ data, error }) => {
            if (!error && data) {
              sb.from("policy_categories")
                .update({ download_count: (data.download_count || 0) + 1 })
                .eq("id", data.id);
            }
          });

      } catch (err) {
        console.error("Download error:", err);
        alert("Could not generate brochure. Please try again.");
      } finally {
        btn.textContent = original;
        btn.disabled    = false;
      }
    });
  });

  // ── Dropdown setup for Policy Selected field ──────────────────────────────────
  // Convert readonly input to select dropdown on page load
  if (policyField && policyField.tagName === "INPUT") {
    const select = document.createElement("select");
    select.id = "policy";
    select.name = "policy";
    select.required = true;
    select.style.width = "100%";
    select.style.padding = "0.75rem";
    select.style.fontSize = "1rem";
    select.style.border = "1px solid #cbd5e1";
    select.style.borderRadius = "8px";
    select.style.fontFamily = "Inter, system-ui, sans-serif";

    // Add default option
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select a policy...";
    select.appendChild(defaultOption);

    // Add all 4 policies
    Object.entries(policyTitles).forEach(([slug, title]) => {
      const option = document.createElement("option");
      option.value = title;
      option.textContent = title;
      select.appendChild(option);
    });

    // Replace input with select
    policyField.replaceWith(select);
    const newPolicyField = document.getElementById("policy");

    // Check URL params for pre-selected policy (from "I'm Interested" button)
    const urlParams = new URLSearchParams(window.location.search);
    const selectedPolicyParam = urlParams.get("policy");
    if (selectedPolicyParam && policyTitles[selectedPolicyParam]) {
      newPolicyField.value = policyTitles[selectedPolicyParam];
    }
  }

  // ── Policy card click → auto-fill contact form policy field ─────────────────
  document.querySelectorAll(".policy-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.tagName === "BUTTON") return;
      const slug = card.dataset.policy;
      const policySelect = document.getElementById("policy");
      if (slug && policySelect && policySelect.tagName === "SELECT") {
        policySelect.value = policyTitles[slug] || "";
      }
    });
  });

  // ── Contact form → insert lead into policy_leads ─────────────────────────────
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;

    const submitBtn = form.querySelector(".submit-button");
    submitBtn.textContent = "Submitting…";
    submitBtn.disabled    = true;

    const nameVal   = document.getElementById("name").value.trim();
    const emailVal  = document.getElementById("email").value.trim();
    const phoneVal  = document.getElementById("phone").value.trim();
    const policySelect = document.getElementById("policy");
    const policyVal = policySelect ? policySelect.value.trim() : "";

    const slugByTitle = Object.fromEntries(
      Object.entries(policyTitles).map(([k, v]) => [v, k])
    );
    const policySlug = slugByTitle[policyVal] || null;

    let categoryId = null;
    if (policySlug) {
      try {
        const { data: catRow, error: catErr } = await sb
          .from("policy_categories")
          .select("id, insert_count")
          .eq("category", policySlug)
          .single();

        if (!catErr && catRow) {
          categoryId = catRow.id;
          sb.from("policy_categories")
            .update({ insert_count: (catRow.insert_count || 0) + 1 })
            .eq("id", catRow.id);
        }
      } catch (lookupErr) {
        console.warn("Category lookup exception:", lookupErr);
      }
    }

    // Column names must match Supabase exactly (PostgreSQL lowercases all unquoted identifiers)
    const leadPayload = {
      name:              nameVal,
      email:             emailVal,
      phone:             phoneVal,
      policy_selected:   policyVal,
      message:           null,
      status:            "new",
      source_page:       "index.html",
      submitted_at:      new Date().toISOString()
    };

    if (categoryId) leadPayload.category_id  = categoryId;
    if (policyVal)  leadPayload.category_name = policyVal;

    console.log("Inserting lead payload:", leadPayload);

    const { data: insertData, error: insertErr } = await sb
      .from("policy_leads")
      .insert([leadPayload])
      .select();

    submitBtn.textContent = "Submit";
    submitBtn.disabled    = false;

    if (insertErr) {
      console.error("Lead insert error:", insertErr);
      const errDetail = insertErr.message || insertErr.details || insertErr.hint || JSON.stringify(insertErr);
      showMessage(successMessage, `Error: ${errDetail}`, "#b91c1c");
    } else {
      console.log("Lead inserted:", insertData);
      showMessage(successMessage, "Thank you! Your request has been submitted successfully.", "#047857");
      form.reset();
      const policySelect = document.getElementById("policy");
      if (policySelect) policySelect.value = "";
    }
  });

  // ── Helpers ──────────────────────────────────────────────────────────────────
  function showMessage(el, text, color) {
    el.textContent = text;
    el.style.color = color || "";
    el.classList.remove("hidden");
    setTimeout(() => el.classList.add("hidden"), 15000);
  }
});
