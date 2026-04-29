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

  // ── Brochure content for each policy (used for offline .html download) ───────
  const brochureData = {
    term: {
      title:       "Term Plans",
      description: "Term insurance offers high-value protection for your family during the years they need it most.",
      benefits:    ["Large life cover at an affordable premium", "Financial protection for dependents", "Flexible policy term and sum assured options"],
      eligibility: "Available for individuals aged 18 to 65. Ideal for salaried professionals and family providers."
    },
    savings: {
      title:       "Savings Plans",
      description: "Build a disciplined savings habit while maintaining protection through a plan designed for long-term goals.",
      benefits:    ["Regular returns with insurance cover", "Loyalty bonuses and maturity benefits", "Helps meet future goals with disciplined savings"],
      eligibility: "Suitable for individuals aged 25 to 55 looking for life cover plus savings."
    },
    children: {
      title:       "Children Plans",
      description: "Protect your child's future with a plan that supports education, milestones, and long-term security.",
      benefits:    ["Funding for education and milestones", "Guaranteed growth with maturity benefits", "Security even in the event of a guardian's loss"],
      eligibility: "Designed for parents and guardians. Covers children from birth through early adulthood."
    },
    retirement: {
      title:       "Retirement Plans",
      description: "Plan for a comfortable retirement with a strategy that creates future income and preserves your lifestyle.",
      benefits:    ["Steady retirement income", "Tax-efficient savings", "Financial independence in later years"],
      eligibility: "Ideal for individuals aged 30 to 55 who want to secure their retirement lifestyle."
    }
  };

  // ── Build a self-contained brochure HTML string ──────────────────────────────
  function buildBrochureHTML(slug) {
    const d = brochureData[slug];
    if (!d) return null;
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
    body{margin:0;padding:2rem;font-family:'Inter',sans-serif;background:var(--bg);color:#0f172a;line-height:2;word-wrap:break-word;}
    h1{font-family:'Playfair Display',serif;font-size:2.5rem;color:var(--primary);margin-bottom:0.25rem;}
    h2{font-family:'Playfair Display',serif;font-size:1.5rem;color:var(--primary);margin-bottom:0.5rem;}
    p,li{font-size:1rem;color:var(--muted);margin:0.5rem 0;}
    ul{padding-left:1.25rem;margin:0.5rem 0 1rem;}
    .section{background:var(--card);border-radius:var(--radius);padding:1.5rem;box-shadow:0 12px 30px rgba(15,23,42,0.08);margin-bottom:1.25rem;}
    .badge{display:inline-block;background:var(--primary);color:#fff;font-size:0.7rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;padding:0.3rem 0.85rem;border-radius:999px;margin-bottom:1rem;}
    .contact{margin-top:1.5rem;padding:1.25rem;background:rgba(30,58,138,0.07);border-radius:var(--radius);}
    .contact strong{display:block;color:var(--primary);margin-bottom:0.4rem;}
    .footer{margin-top:2rem;text-align:center;font-size:0.8rem;color:#94a3b8;}
  </style>
</head>
<body>
  <div class="badge">TATA-AIA Insurance</div>
  <h1>${d.title}</h1>
  <p style="color:#64748b;margin-bottom:1.5rem;">Official Brochure &mdash; K. Srinivasa Rao, Advisor</p>

  <div class="section">
    <h2>About This Plan</h2>
    <p>${d.description}</p>
  </div>

  <div class="section">
    <h2>Key Benefits</h2>
    <ul>${d.benefits.map(b => `<li>${b}</li>`).join("")}</ul>
  </div>

  <div class="section">
    <h2>Eligibility</h2>
    <p>${d.eligibility}</p>
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
      window.open(`${btn.dataset.policy}.html`, "_blank");
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

  // ── Policy card click → auto-fill contact form policy field ─────────────────
  document.querySelectorAll(".policy-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.tagName === "BUTTON") return;
      const slug = card.dataset.policy;
      if (slug && policyField) {
        policyField.value = policyTitles[slug] || "";
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
    const policyVal = policyField.value.trim();

    const slugByTitle = Object.fromEntries(
      Object.entries(policyTitles).map(([k, v]) => [v, k])
    );
    const policySlug = slugByTitle[policyVal] || selectedPolicy || null;

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
      policyField.value = "";
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
