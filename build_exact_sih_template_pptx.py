import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def build_presentation():
    prs = Presentation()
    # Exact US Letter Landscape (11 x 8.5 inches) matching sih2026 (1).pdf
    prs.slide_width = Inches(11.0)
    prs.slide_height = Inches(8.5)

    blank_layout = prs.slide_layouts[6]

    # Colors matching the PDF template
    WHITE = RGBColor(255, 255, 255)
    BLACK = RGBColor(0, 0, 0)
    SIH_BLUE = RGBColor(0, 102, 178)       # Bottom banner blue (#0066B2)
    HEADER_BLUE = RGBColor(26, 54, 93)     # Title blue (#1A365D)
    SUBTITLE_BLUE = RGBColor(0, 76, 153)   # Subhead blue (#004C99)
    GRAY_TEXT = RGBColor(80, 80, 80)

    # Asset paths
    LOGO_INNOVA8 = "sih_slides_img/page_1_img_3_Image3.jpg"
    LOGO_SIH_TOP = "sih_slides_img/page_1_img_2_Image2.jpg"
    LOGO_SIH_BULB = "sih_slides_img/page_1_img_1_Image1.jpg"

    def set_white_bg(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(11.0), Inches(8.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = WHITE
        bg.line.fill.background()
        return bg

    def add_top_logos(slide):
        if os.path.exists(LOGO_INNOVA8):
            slide.shapes.add_picture(LOGO_INNOVA8, Inches(0.4), Inches(0.35), width=Inches(1.0), height=Inches(1.0))
        if os.path.exists(LOGO_SIH_TOP):
            slide.shapes.add_picture(LOGO_SIH_TOP, Inches(8.8), Inches(0.35), width=Inches(1.8), height=Inches(0.9))

    def add_slide_header(slide, title_text):
        add_top_logos(slide)
        # Center Title in Times New Roman bold
        tb = slide.shapes.add_textbox(Inches(1.5), Inches(0.45), Inches(7.2), Inches(0.8))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title_text
        p.font.name = "Times New Roman"
        p.font.size = Pt(28)
        p.font.bold = True
        p.font.color.rgb = BLACK
        p.alignment = PP_ALIGN.CENTER

    def add_bottom_banner(slide, page_num_str):
        # Blue banner across entire bottom
        banner = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, Inches(7.9), Inches(11.0), Inches(0.6))
        banner.fill.solid()
        banner.fill.fore_color.rgb = SIH_BLUE
        banner.line.fill.background()

        # Text inside banner
        tb = slide.shapes.add_textbox(Inches(1.0), Inches(7.95), Inches(9.0), Inches(0.5))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = "@SIH Idea submission- Template"
        p.font.name = "Calibri"
        p.font.size = Pt(11)
        p.font.color.rgb = WHITE
        p.alignment = PP_ALIGN.CENTER

        # Slide number on far right
        tb_num = slide.shapes.add_textbox(Inches(9.8), Inches(7.95), Inches(0.8), Inches(0.5))
        tf_num = tb_num.text_frame
        p_num = tf_num.paragraphs[0]
        p_num.text = str(page_num_str)
        p_num.font.name = "Calibri"
        p_num.font.size = Pt(11)
        p_num.font.bold = True
        p_num.font.color.rgb = WHITE
        p_num.alignment = PP_ALIGN.RIGHT

    # =========================================================================
    # SLIDE 1: TITLE PAGE
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    set_white_bg(s1)
    add_top_logos(s1)

    # Top Center Title: SMART INDIA HACKATHON 2025
    tb_sih = s1.shapes.add_textbox(Inches(1.5), Inches(0.4), Inches(7.2), Inches(0.6))
    tf_sih = tb_sih.text_frame
    p_sih = tf_sih.paragraphs[0]
    p_sih.text = "SMART INDIA HACKATHON 2025"
    p_sih.font.name = "Calibri"
    p_sih.font.size = Pt(28)
    p_sih.font.bold = True
    p_sih.font.color.rgb = HEADER_BLUE
    p_sih.alignment = PP_ALIGN.CENTER

    # Subtitle: TITLE PAGE
    tb_tp = s1.shapes.add_textbox(Inches(2.5), Inches(1.15), Inches(5.2), Inches(0.5))
    tf_tp = tb_tp.text_frame
    p_tp = tf_tp.paragraphs[0]
    p_tp.text = "TITLE PAGE"
    p_tp.font.name = "Times New Roman"
    p_tp.font.size = Pt(22)
    p_tp.font.bold = True
    p_tp.font.color.rgb = BLACK
    p_tp.alignment = PP_ALIGN.CENTER

    # Left bullet list
    tb_left = s1.shapes.add_textbox(Inches(0.5), Inches(1.85), Inches(6.0), Inches(5.5))
    tf_left = tb_left.text_frame
    tf_left.word_wrap = True

    def add_s1_bullet(tf, bold_label, val_italic, is_first=False):
        p = tf.paragraphs[0] if is_first else tf.add_paragraph()
        p.space_after = Pt(12)
        p.font.name = "Calibri"
        
        # Bullet dot
        run_dot = p.add_run()
        run_dot.text = "•  "
        run_dot.font.bold = True
        run_dot.font.size = Pt(14)
        run_dot.font.color.rgb = BLACK
        
        # Bold label
        run_label = p.add_run()
        run_label.text = bold_label + " "
        run_label.font.bold = True
        run_label.font.size = Pt(14)
        run_label.font.color.rgb = BLACK
        
        # Italic value
        run_val = p.add_run()
        run_val.text = val_italic
        run_val.font.italic = True
        run_val.font.size = Pt(14)
        run_val.font.color.rgb = SUBTITLE_BLUE

    add_s1_bullet(tf_left, "Problem Statement ID -", "SIH26102", True)
    add_s1_bullet(tf_left, "Problem Statement Title  -", "AI-powered system to detect anomalies, fraud, and inefficiencies in MPLAD Scheme implementation regd.")
    add_s1_bullet(tf_left, "Theme  -", "Smart Governance, e-Governance and Smart Automation")
    add_s1_bullet(tf_left, "PS Category -", "Software")
    add_s1_bullet(tf_left, "Team ID –", "T049")
    add_s1_bullet(tf_left, "Team Name –", "Innova8")

    # Center/Right: Large SIH Bulb graphic
    if os.path.exists(LOGO_SIH_BULB):
        s1.shapes.add_picture(LOGO_SIH_BULB, Inches(6.1), Inches(1.8), width=Inches(3.3), height=Inches(3.8))

    # Bottom Right: 2 columns of team members in Calibri
    tb_team1 = s1.shapes.add_textbox(Inches(5.0), Inches(6.4), Inches(3.0), Inches(1.5))
    tf_team1 = tb_team1.text_frame
    tf_team1.word_wrap = True
    team_col1 = [
        "Siddhant Sinha | 25070123109",
        "Alisha Mittal | 25070126214",
        "Nirvan Joneja | 25070126117"
    ]
    for idx, member in enumerate(team_col1):
        p = tf_team1.paragraphs[0] if idx == 0 else tf_team1.add_paragraph()
        p.text = member
        p.font.name = "Calibri"
        p.font.size = Pt(11)
        p.font.color.rgb = BLACK

    tb_team2 = s1.shapes.add_textbox(Inches(7.8), Inches(6.4), Inches(3.0), Inches(1.5))
    tf_team2 = tb_team2.text_frame
    tf_team2.word_wrap = True
    team_col2 = [
        "Mannat Tanda | 25070126107",
        "Kushal Shah | 25070126097",
        "Karthik Prakash | 25070126088"
    ]
    for idx, member in enumerate(team_col2):
        p = tf_team2.paragraphs[0] if idx == 0 else tf_team2.add_paragraph()
        p.text = member
        p.font.name = "Calibri"
        p.font.size = Pt(11)
        p.font.color.rgb = BLACK

    # =========================================================================
    # SLIDE 2: ADDRESSING THE ISSUE
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    set_white_bg(s2)
    add_slide_header(s2, "ADDRESSING THE ISSUE")
    add_bottom_banner(s2, "2")

    # The exact comparison table graphic from the template
    img2_1 = "sih_slides_img/page_2_img_1_Image1.jpg"
    img2_2 = "sih_slides_img/page_2_img_2_Image2.jpg"
    if os.path.exists(img2_1):
        s2.shapes.add_picture(img2_1, Inches(0.4), Inches(1.6), width=Inches(10.2), height=Inches(3.55))
    if os.path.exists(img2_2):
        s2.shapes.add_picture(img2_2, Inches(0.4), Inches(5.15), width=Inches(10.2), height=Inches(1.85))

    # =========================================================================
    # SLIDE 3: TECHNICAL APPROACH
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    set_white_bg(s3)
    add_slide_header(s3, "TECHNICAL APPROACH")
    add_bottom_banner(s3, "3")

    # Subheading: TECHNICAL STACK
    tb_ts = s3.shapes.add_textbox(Inches(0.5), Inches(1.5), Inches(4.5), Inches(0.5))
    tf_ts = tb_ts.text_frame
    p_ts = tf_ts.paragraphs[0]
    p_ts.text = "TECHNICAL STACK"
    p_ts.font.name = "Times New Roman"
    p_ts.font.size = Pt(16)
    p_ts.font.bold = True
    p_ts.font.color.rgb = BLACK

    # Left bullet points with bold categories
    tb_stack = s3.shapes.add_textbox(Inches(0.5), Inches(2.0), Inches(5.0), Inches(5.7))
    tf_stack = tb_stack.text_frame
    tf_stack.word_wrap = True

    tech_bullets = [
        ("Frontend", "— React.js, Tailwind, PWA officer dashboard"),
        ("Backend/API", "— FastAPI or Django REST, orchestrates the pipeline"),
        ("OCR/NLP", "— Tesseract/Vision API + HuggingFace NER"),
        ("Forgery detection", "— PyTorch CNN, ELA-based"),
        ("Risk scoring", "— XGBoost / scikit-learn"),
        ("Entity matching", "— Sentence-Transformers + FAISS"),
        ("Explainability", "— SHAP"),
        ("MLOps", "— MLflow, scheduled retraining"),
        ("Data/Infra", "— PostgreSQL, Docker/NGINX, gov cloud VM"),
        ("Security", "— JWT auth, AES-256 at rest, TLS 1.3 in transit")
    ]

    for idx, (cat, desc) in enumerate(tech_bullets):
        p = tf_stack.paragraphs[0] if idx == 0 else tf_stack.add_paragraph()
        p.space_after = Pt(5)
        p.font.name = "Calibri"
        
        run_dot = p.add_run()
        run_dot.text = "•  "
        run_dot.font.bold = True
        run_dot.font.size = Pt(10.5)
        run_dot.font.color.rgb = BLACK

        run_cat = p.add_run()
        run_cat.text = cat + " "
        run_cat.font.bold = True
        run_cat.font.size = Pt(10.5)
        run_cat.font.color.rgb = BLACK

        run_desc = p.add_run()
        run_desc.text = desc
        run_desc.font.size = Pt(10.5)
        run_desc.font.color.rgb = BLACK

    # Right: Technical Stack Diagram
    img3 = "sih_slides_img/page_3_img_2_Image2.jpg"
    if os.path.exists(img3):
        s3.shapes.add_picture(img3, Inches(5.3), Inches(2.1), width=Inches(5.3), height=Inches(4.5))

    # =========================================================================
    # SLIDE 4: FEASIBILITY AND VIABILITY
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    set_white_bg(s4)
    add_slide_header(s4, "FEASIBILITY AND VIABILITY")
    add_bottom_banner(s4, "4")

    # Left: Workflow Diagram
    img4 = "sih_slides_img/page_4_img_2_Image2.jpg"
    if os.path.exists(img4):
        s4.shapes.add_picture(img4, Inches(0.5), Inches(1.8), width=Inches(4.3), height=Inches(5.5))

    # Right: Feasibility and Viability text
    tb_fv = s4.shapes.add_textbox(Inches(5.0), Inches(1.7), Inches(5.6), Inches(5.8))
    tf_fv = tb_fv.text_frame
    tf_fv.word_wrap = True

    # Feasibility Section
    p_f = tf_fv.paragraphs[0]
    p_f.text = "Feasibility"
    p_f.font.name = "Calibri"
    p_f.font.size = Pt(15)
    p_f.font.bold = True
    p_f.font.color.rgb = SUBTITLE_BLUE
    p_f.space_after = Pt(4)

    p_f1 = tf_fv.add_paragraph()
    p_f1.space_after = Pt(8)
    p_f1.font.name = "Calibri"
    r = p_f1.add_run()
    r.text = "•  The technology is ready: "
    r.font.bold = True
    r.font.size = Pt(11.5)
    r.font.color.rgb = BLACK
    r2 = p_f1.add_run()
    r2.text = "The AI tools needed to spot fraud and unusual patterns already exist and are widely used by banks today."
    r2.font.size = Pt(11.5)
    r2.font.color.rgb = BLACK

    p_f2 = tf_fv.add_paragraph()
    p_f2.space_after = Pt(16)
    p_f2.font.name = "Calibri"
    r = p_f2.add_run()
    r.text = "•  Getting good data is hard: "
    r.font.bold = True
    r.font.size = Pt(11.5)
    r.font.color.rgb = BLACK
    r2 = p_f2.add_run()
    r2.text = "The AI is only as smart as the information it gets, so forcing all local government offices to upload clean, digital records will be a major challenge."
    r2.font.size = Pt(11.5)
    r2.font.color.rgb = BLACK

    # Viability Section
    p_v = tf_fv.add_paragraph()
    p_v.text = "Viability"
    p_v.font.name = "Calibri"
    p_v.font.size = Pt(15)
    p_v.font.bold = True
    p_v.font.color.rgb = SUBTITLE_BLUE
    p_v.space_after = Pt(4)

    p_v1 = tf_fv.add_paragraph()
    p_v1.space_after = Pt(8)
    p_v1.font.name = "Calibri"
    r = p_v1.add_run()
    r.text = "•  It saves a lot of money: "
    r.font.bold = True
    r.font.size = Pt(11.5)
    r.font.color.rgb = BLACK
    r2 = p_v1.add_run()
    r2.text = "The system will easily pay for itself by stopping wasted funds, fake projects, and contractor corruption."
    r2.font.size = Pt(11.5)
    r2.font.color.rgb = BLACK

    p_v2 = tf_fv.add_paragraph()
    p_v2.space_after = Pt(6)
    p_v2.font.name = "Calibri"
    r = p_v2.add_run()
    r.text = "•  People will fight it: "
    r.font.bold = True
    r.font.size = Pt(11.5)
    r.font.color.rgb = BLACK
    r2 = p_v2.add_run()
    r2.text = "Corrupt officials or dishonest contractors who make money off the current broken system will strongly resist using this AI."
    r2.font.size = Pt(11.5)
    r2.font.color.rgb = BLACK

    # =========================================================================
    # SLIDE 5: IMPACT AND BENEFITS
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    set_white_bg(s5)
    add_slide_header(s5, "IMPACT AND BENEFITS")
    add_bottom_banner(s5, "5")

    # Left: Impact & Benefits bullet list
    tb_imp = s5.shapes.add_textbox(Inches(0.5), Inches(1.8), Inches(5.6), Inches(5.8))
    tf_imp = tb_imp.text_frame
    tf_imp.word_wrap = True

    impact_points = [
        ("10x Faster Clearances:", "Auto-approves low-risk projects in under 48 hours instead of taking 15–30 days."),
        ("Targeted Officer Review:", "Uses risk scoring so officials only spend 3–5 minutes reviewing high-risk files."),
        ("Total Forgery Detection:", "Scans every single bill and certificate for tampering, leaving no blind spots."),
        ("Prevents Duplicate Funding:", "Cross-checks department data to stop the same work from being billed under multiple schemes."),
        ("Continuous Learning:", "Updates automatically from officer feedback to catch new fraud patterns.")
    ]

    for idx, (title, desc) in enumerate(impact_points):
        p = tf_imp.paragraphs[0] if idx == 0 else tf_imp.add_paragraph()
        p.space_after = Pt(10)
        p.font.name = "Calibri"

        run_dot = p.add_run()
        run_dot.text = "•  "
        run_dot.font.bold = True
        run_dot.font.size = Pt(12)
        run_dot.font.color.rgb = BLACK

        run_title = p.add_run()
        run_title.text = title + "\n   "
        run_title.font.bold = True
        run_title.font.size = Pt(12)
        run_title.font.color.rgb = BLACK

        run_desc = p.add_run()
        run_desc.text = desc
        run_desc.font.size = Pt(11.5)
        run_desc.font.color.rgb = BLACK

    # Right: Intelligent MPLAD Project Workflow diagram
    img5 = "sih_slides_img/page_5_img_2_Image2.jpg"
    if os.path.exists(img5):
        s5.shapes.add_picture(img5, Inches(6.3), Inches(2.0), width=Inches(4.3), height=Inches(5.0))

    # =========================================================================
    # SLIDE 6: RESEARCH AND REFERENCES
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    set_white_bg(s6)
    add_slide_header(s6, "RESEARCH AND REFERENCES")
    add_bottom_banner(s6, "6")

    # Left: Policy and Technical research
    tb_res = s6.shapes.add_textbox(Inches(0.5), Inches(1.8), Inches(5.2), Inches(5.8))
    tf_res = tb_res.text_frame
    tf_res.word_wrap = True

    # Policy section
    p_phead = tf_res.paragraphs[0]
    p_phead.text = "Policy & government frameworks (2 sources)"
    p_phead.font.name = "Calibri"
    p_phead.font.size = Pt(13)
    p_phead.font.bold = True
    p_phead.font.underline = True
    p_phead.font.color.rgb = SUBTITLE_BLUE
    p_phead.space_after = Pt(6)

    policy_pts = [
        "Right to Public Services (RTS) Act — turnaround benchmarks",
        "MeitY Digital India / e-Governance AI adoption guidelines"
    ]
    for pt in policy_pts:
        p = tf_res.add_paragraph()
        p.space_after = Pt(5)
        p.font.name = "Calibri"
        r_dot = p.add_run()
        r_dot.text = "•  "
        r_dot.font.bold = True
        r_dot.font.size = Pt(11.5)
        r_dot.font.color.rgb = BLACK
        r_txt = p.add_run()
        r_txt.text = pt
        r_txt.font.size = Pt(11.5)
        r_txt.font.color.rgb = BLACK

    # Technical section
    p_thead = tf_res.add_paragraph()
    p_thead.space_before = Pt(12)
    p_thead.space_after = Pt(6)
    p_thead.text = "Technical research (2 sources)"
    p_thead.font.name = "Calibri"
    p_thead.font.size = Pt(13)
    p_thead.font.bold = True
    p_thead.font.underline = True
    p_thead.font.color.rgb = SUBTITLE_BLUE

    tech_pts = [
        "CNN-based document forgery detection (ELA methods)",
        "SHAP — SHapley Additive exPlanations, explainability framework"
    ]
    for pt in tech_pts:
        p = tf_res.add_paragraph()
        p.space_after = Pt(5)
        p.font.name = "Calibri"
        r_dot = p.add_run()
        r_dot.text = "•  "
        r_dot.font.bold = True
        r_dot.font.size = Pt(11.5)
        r_dot.font.color.rgb = BLACK
        r_txt = p.add_run()
        r_txt.text = pt
        r_txt.font.size = Pt(11.5)
        r_txt.font.color.rgb = BLACK

    # Right: END TO END WORKFLOW
    tb_wf_badge = s6.shapes.add_textbox(Inches(5.7), Inches(1.8), Inches(4.8), Inches(0.4))
    tf_wf_badge = tb_wf_badge.text_frame
    p_wf = tf_wf_badge.paragraphs[0]
    p_wf.text = "END TO END WORKFLOW"
    p_wf.font.name = "Calibri"
    p_wf.font.size = Pt(13)
    p_wf.font.bold = True
    p_wf.font.color.rgb = WHITE
    tb_wf_badge.fill.solid()
    tb_wf_badge.fill.fore_color.rgb = RGBColor(0, 102, 128)

    img6 = "sih_slides_img/page_6_img_2_Image2.jpg"
    if os.path.exists(img6):
        s6.shapes.add_picture(img6, Inches(5.7), Inches(2.4), width=Inches(4.9), height=Inches(4.8))

    # Add Speaker Notes to each slide
    s1.notes_slide.notes_text_frame.text = (
        "Good morning esteemed judges and jury members. We are Team Innova8 (Team ID: T049), "
        "presenting our solution for Problem Statement SIH26102: 'AI-powered system to detect anomalies, "
        "fraud, and inefficiencies in MPLAD Scheme implementation and e-Governance'.\n\n"
        "Our solution, AutoGov+, is an end-to-end, privacy-preserving automated verification and adjudication "
        "platform. It is fully built and deployed live on the cloud at: https://printed-blind-lil-arch.trycloudflare.com."
    )

    s2.notes_slide.notes_text_frame.text = (
        "Examining the ground reality of citizen document and scheme adjudication: Today, files take 15 to 30 days "
        "because officers manually inspect thousands of dossiers. Caseworkers spend equal time on authentic and fraudulent files. "
        "AutoGov+ completely transforms this with an autonomous decision layer that clears low-risk cases in seconds, "
        "scans 100% of documents for tampering, catches cross-department duplicate applicants, and automates judgment calls."
    )

    s3.notes_slide.notes_text_frame.text = (
        "Our Technical Stack combines React and Tailwind for the Officer PWA dashboard, FastAPI/Express backend, "
        "OpenCV/Tesseract for OCR and LayoutLM geometry classification, PyTorch CNN with ELA for forgery detection, "
        "XGBoost for calibrated risk scoring, Sentence-Transformers + FAISS for duplicate matching, SHAP for explainable AI, "
        "and strict AES-256 encryption with TLS 1.3 and zero-PII retention."
    )

    s4.notes_slide.notes_text_frame.text = (
        "Feasibility and Viability: The technology is battle-tested in banking and defense. We handle real-world noisy camera scans "
        "through automated pre-processing. Viability: The platform saves massive public funds by halting fake projects, "
        "and provides an intuitive Human-in-the-Loop Cockpit that empowers officers with mathematical SHAP evidence and immutable audit trails."
    )

    s5.notes_slide.notes_text_frame.text = (
        "Impact and Benefits: 10x faster clearances (<48h for complex files, 4.8s for standard certificates), "
        "targeted officer review (3-5 minutes on flagged files), 100% forgery scanning, prevention of duplicate funding across schemes, "
        "and continuous learning that updates from officer overrides."
    )

    s6.notes_slide.notes_text_frame.text = (
        "Research and References: Grounded in statutory policy (Right to Public Services Act, MeitY Digital India AI Guidelines, DPDP Act 2023) "
        "and scientific research (CNN Error Level Analysis and SHAP explainability). "
        "Our 10-step end-to-end pipeline is fully operational. We invite the jury to test our live demo at: "
        "https://printed-blind-lil-arch.trycloudflare.com."
    )

    output_path = "AutoGov_SIH_2026_Official.pptx"
    prs.save(output_path)
    print(f"Presentation saved successfully with exact template and fonts to: {os.path.abspath(output_path)}")

if __name__ == "__main__":
    build_presentation()
