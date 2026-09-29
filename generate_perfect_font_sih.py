import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def create_perfect_presentation():
    prs = Presentation()
    # 11.0 x 8.5 inches (792 x 612 pt) - exact match to the PDF
    prs.slide_width = Inches(11.0)
    prs.slide_height = Inches(8.5)

    blank_layout = prs.slide_layouts[6]

    # Colors
    WHITE = RGBColor(255, 255, 255)
    BLACK = RGBColor(0, 0, 0)
    SIH_BLUE = RGBColor(0, 102, 178)       # #0066B2
    HEADER_BLUE = RGBColor(26, 54, 93)     # #1A365D
    SUBTITLE_BLUE = RGBColor(0, 76, 153)   # #004C99

    # Logos
    LOGO_INNOVA8 = "sih_slides_img/page_1_img_3_Image3.jpg"
    LOGO_SIH_TOP = "sih_slides_img/page_1_img_2_Image2.jpg"
    LOGO_SIH_BULB = "sih_slides_img/page_1_img_1_Image1.jpg"

    def set_white_bg(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(11.0), Inches(8.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = WHITE
        bg.line.fill.background()
        return bg

    def add_header(slide, title_text):
        if os.path.exists(LOGO_INNOVA8):
            slide.shapes.add_picture(LOGO_INNOVA8, Inches(0.35), Inches(0.35), width=Inches(1.0), height=Inches(1.0))
        if os.path.exists(LOGO_SIH_TOP):
            slide.shapes.add_picture(LOGO_SIH_TOP, Inches(8.8), Inches(0.35), width=Inches(1.85), height=Inches(0.95))

        # Title: Times New Roman Bold 30pt (exact font from PDF screenshot)
        tb = slide.shapes.add_textbox(Inches(1.5), Inches(0.45), Inches(7.2), Inches(0.85))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title_text
        p.font.name = "Times New Roman"
        p.font.size = Pt(30)
        p.font.bold = True
        p.font.color.rgb = BLACK
        p.alignment = PP_ALIGN.CENTER

    def add_bottom_bar(slide, page_num):
        # Full width blue bar
        bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, Inches(7.9), Inches(11.0), Inches(0.6))
        bar.fill.solid()
        bar.fill.fore_color.rgb = SIH_BLUE
        bar.line.fill.background()

        tb = slide.shapes.add_textbox(Inches(1.0), Inches(7.95), Inches(9.0), Inches(0.5))
        tf = tb.text_frame
        p = tf.paragraphs[0]
        p.text = "@SIH Idea submission- Template"
        p.font.name = "Calibri"
        p.font.size = Pt(10)
        p.font.color.rgb = WHITE
        p.alignment = PP_ALIGN.CENTER

        tb_num = slide.shapes.add_textbox(Inches(9.8), Inches(7.95), Inches(0.8), Inches(0.5))
        tf_num = tb_num.text_frame
        p_num = tf_num.paragraphs[0]
        p_num.text = str(page_num)
        p_num.font.name = "Calibri"
        p_num.font.size = Pt(10)
        p_num.font.bold = True
        p_num.font.color.rgb = WHITE
        p_num.alignment = PP_ALIGN.RIGHT

    # =========================================================================
    # SLIDE 1: TITLE PAGE
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    set_white_bg(s1)
    if os.path.exists(LOGO_INNOVA8):
        s1.shapes.add_picture(LOGO_INNOVA8, Inches(0.35), Inches(0.35), width=Inches(1.0), height=Inches(1.0))
    if os.path.exists(LOGO_SIH_TOP):
        s1.shapes.add_picture(LOGO_SIH_TOP, Inches(8.8), Inches(0.35), width=Inches(1.85), height=Inches(0.95))

    # Top Center Title (Times New Roman Bold 30pt - exact match to template)
    tb_s1_top = s1.shapes.add_textbox(Inches(1.5), Inches(0.35), Inches(7.2), Inches(0.6))
    tf_s1_top = tb_s1_top.text_frame
    p_s1_top = tf_s1_top.paragraphs[0]
    p_s1_top.text = "SMART INDIA HACKATHON 2025"
    p_s1_top.font.name = "Times New Roman"
    p_s1_top.font.size = Pt(29)
    p_s1_top.font.bold = True
    p_s1_top.font.color.rgb = HEADER_BLUE
    p_s1_top.alignment = PP_ALIGN.CENTER

    # Subtitle: TITLE PAGE (Times New Roman)
    tb_s1_sub = s1.shapes.add_textbox(Inches(2.5), Inches(1.05), Inches(5.2), Inches(0.5))
    tf_s1_sub = tb_s1_sub.text_frame
    p_s1_sub = tf_s1_sub.paragraphs[0]
    p_s1_sub.text = "TITLE PAGE"
    p_s1_sub.font.name = "Times New Roman"
    p_s1_sub.font.size = Pt(24)
    p_s1_sub.font.bold = True
    p_s1_sub.font.color.rgb = BLACK
    p_s1_sub.alignment = PP_ALIGN.CENTER

    # Left bullet list
    tb_s1_left = s1.shapes.add_textbox(Inches(0.4), Inches(1.75), Inches(6.0), Inches(5.8))
    tf_s1_left = tb_s1_left.text_frame
    tf_s1_left.word_wrap = True

    s1_bullets = [
        ("Problem Statement ID - ", "SIH26102", None),
        ("Problem Statement Title  - ", "AI-powered system to detect anomalies, fraud, and inefficiencies in MPLAD Scheme implementation regd.", None),
        ("Theme  - ", "Smart Governance, e-Governance and Smart Automation", None),
        ("PS Category - ", "Software", None),
        ("Team ID – ", "T049", None),
        ("Team Name – ", "Innova8", None),
        ("Live Prototype URL – ", "https://printed-blind-lil-arch.trycloudflare.com", "https://printed-blind-lil-arch.trycloudflare.com"),
        ("GitHub Repository – ", "https://github.com/kushalshahbtech2025-coder/autogov", "https://github.com/kushalshahbtech2025-coder/autogov")
    ]
    for idx, (lbl, val, link_url) in enumerate(s1_bullets):
        p = tf_s1_left.paragraphs[0] if idx == 0 else tf_s1_left.add_paragraph()
        p.space_after = Pt(7)
        p.font.name = "Calibri"

        r_dot = p.add_run()
        r_dot.text = "•  "
        r_dot.font.name = "Arial"
        r_dot.font.bold = True
        r_dot.font.size = Pt(12)
        r_dot.font.color.rgb = BLACK

        r_lbl = p.add_run()
        r_lbl.text = lbl
        r_lbl.font.name = "Calibri"
        r_lbl.font.bold = True
        r_lbl.font.size = Pt(12)
        r_lbl.font.color.rgb = BLACK

        r_val = p.add_run()
        r_val.text = val
        r_val.font.name = "Calibri"
        r_val.font.size = Pt(12)
        if link_url:
            r_val.font.bold = True
            r_val.font.underline = True
            r_val.font.color.rgb = RGBColor(0, 102, 204)
            r_val.hyperlink.address = link_url
        else:
            r_val.font.italic = True
            r_val.font.color.rgb = SUBTITLE_BLUE

    # Center/Right: Bulb Graphic
    if os.path.exists(LOGO_SIH_BULB):
        s1.shapes.add_picture(LOGO_SIH_BULB, Inches(6.1), Inches(1.75), width=Inches(3.3), height=Inches(3.9))

    # Bottom Right: 2 columns of team members in Calibri
    tb_t1 = s1.shapes.add_textbox(Inches(5.0), Inches(6.35), Inches(3.0), Inches(1.5))
    tf_t1 = tb_t1.text_frame
    tf_t1.word_wrap = True
    col1 = ["Siddhant Sinha | 25070123109", "Alisha Mittal | 25070126214", "Nirvan Joneja | 25070126117"]
    for idx, m in enumerate(col1):
        p = tf_t1.paragraphs[0] if idx == 0 else tf_t1.add_paragraph()
        p.text = m
        p.font.name = "Calibri"
        p.font.size = Pt(11)
        p.font.color.rgb = BLACK

    tb_t2 = s1.shapes.add_textbox(Inches(7.8), Inches(6.35), Inches(3.0), Inches(1.5))
    tf_t2 = tb_t2.text_frame
    tf_t2.word_wrap = True
    col2 = ["Mannat Tanda | 25070126107", "Kushal Shah | 25070126097", "Karthik Prakash | 25070126088"]
    for idx, m in enumerate(col2):
        p = tf_t2.paragraphs[0] if idx == 0 else tf_t2.add_paragraph()
        p.text = m
        p.font.name = "Calibri"
        p.font.size = Pt(11)
        p.font.color.rgb = BLACK

    # =========================================================================
    # SLIDE 2: ADDRESSING THE ISSUE
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    set_white_bg(s2)
    add_header(s2, "ADDRESSING THE ISSUE")
    add_bottom_bar(s2, 2)

    img2_1 = "sih_slides_img/page_2_img_1_Image1.jpg"
    img2_2 = "sih_slides_img/page_2_img_2_Image2.jpg"
    if os.path.exists(img2_1):
        s2.shapes.add_picture(img2_1, Inches(0.4), Inches(1.55), width=Inches(10.2), height=Inches(3.55))
    if os.path.exists(img2_2):
        s2.shapes.add_picture(img2_2, Inches(0.4), Inches(5.1), width=Inches(10.2), height=Inches(1.85))

    # =========================================================================
    # SLIDE 3: TECHNICAL APPROACH
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    set_white_bg(s3)
    add_header(s3, "TECHNICAL APPROACH")
    add_bottom_bar(s3, 3)

    # Subheading: TECHNICAL STACK (Times New Roman Bold)
    tb_s3_sub = s3.shapes.add_textbox(Inches(0.4), Inches(1.45), Inches(4.5), Inches(0.45))
    tf_s3_sub = tb_s3_sub.text_frame
    p_s3_sub = tf_s3_sub.paragraphs[0]
    p_s3_sub.text = "TECHNICAL STACK"
    p_s3_sub.font.name = "Times New Roman"
    p_s3_sub.font.size = Pt(16)
    p_s3_sub.font.bold = True
    p_s3_sub.font.color.rgb = BLACK

    # Stack bullets in exact Calibri Bold + Calibri Regular format
    tb_s3_left = s3.shapes.add_textbox(Inches(0.4), Inches(1.95), Inches(4.8), Inches(5.7))
    tf_s3_left = tb_s3_left.text_frame
    tf_s3_left.word_wrap = True

    stack_items = [
        ("Frontend", "— React.js, Tailwind, PWA officer dashboard", None),
        ("Backend/API", "— Node.js / Express + Tesseract OCR engine", None),
        ("OCR/Extraction", "— Tesseract.js in-process real engine + NER", None),
        ("Forgery detection", "— PyTorch CNN, ELA-based artifact detector", None),
        ("Risk scoring", "— XGBoost / scikit-learn risk engine", None),
        ("Entity matching", "— Sentence-Transformers + FAISS deduplication", None),
        ("Explainability", "— SHAP feature contribution tree", None),
        ("MLOps", "— MLflow & automated dataset retraining", None),
        ("Data/Infra", "— PostgreSQL, Docker, Cloudflare Zero Trust", None),
        ("Security", "— JWT auth, AES-256 at rest, TLS 1.3 in transit", None),
        ("Live Prototype", "— https://printed-blind-lil-arch.trycloudflare.com (PWA Gateway)", "https://printed-blind-lil-arch.trycloudflare.com")
    ]
    for idx, (cat, desc, link_url) in enumerate(stack_items):
        p = tf_s3_left.paragraphs[0] if idx == 0 else tf_s3_left.add_paragraph()
        p.space_after = Pt(5)
        p.font.name = "Calibri"

        r_dot = p.add_run()
        r_dot.text = "•  "
        r_dot.font.name = "Arial"
        r_dot.font.bold = True
        r_dot.font.size = Pt(10.5)
        r_dot.font.color.rgb = BLACK

        r_cat = p.add_run()
        r_cat.text = cat + " "
        r_cat.font.name = "Calibri"
        r_cat.font.bold = True
        r_cat.font.size = Pt(10.5)
        r_cat.font.color.rgb = BLACK

        r_desc = p.add_run()
        r_desc.text = desc
        r_desc.font.name = "Calibri"
        r_desc.font.size = Pt(10.5)
        if link_url:
            r_desc.font.bold = True
            r_desc.font.underline = True
            r_desc.font.color.rgb = RGBColor(0, 102, 204)
            r_desc.hyperlink.address = link_url
        else:
            r_desc.font.color.rgb = BLACK

    # Diagram on right
    img3 = "sih_slides_img/page_3_img_2_Image2.jpg"
    if os.path.exists(img3):
        s3.shapes.add_picture(img3, Inches(5.2), Inches(2.0), width=Inches(5.4), height=Inches(4.6))

    # =========================================================================
    # SLIDE 4: FEASIBILITY AND VIABILITY
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    set_white_bg(s4)
    add_header(s4, "FEASIBILITY AND VIABILITY")
    add_bottom_bar(s4, 4)

    # Workflow diagram on left
    img4 = "sih_slides_img/page_4_img_2_Image2.jpg"
    if os.path.exists(img4):
        s4.shapes.add_picture(img4, Inches(0.5), Inches(1.75), width=Inches(4.2), height=Inches(5.5))

    # Feasibility and Viability text on right (Calibri Bold header + body, exact match to PDF)
    tb_s4_right = s4.shapes.add_textbox(Inches(4.9), Inches(1.65), Inches(5.7), Inches(5.8))
    tf_s4_right = tb_s4_right.text_frame
    tf_s4_right.word_wrap = True

    # Feasibility
    p_f = tf_s4_right.paragraphs[0]
    p_f.text = "Feasibility"
    p_f.font.name = "Calibri"
    p_f.font.size = Pt(15)
    p_f.font.bold = True
    p_f.font.color.rgb = SUBTITLE_BLUE
    p_f.space_after = Pt(4)

    p_f1 = tf_s4_right.add_paragraph()
    p_f1.space_after = Pt(8)
    p_f1.font.name = "Calibri"
    r1 = p_f1.add_run()
    r1.text = "•  The technology is ready: "
    r1.font.bold = True
    r1.font.size = Pt(11.5)
    r1.font.color.rgb = BLACK
    r2 = p_f1.add_run()
    r2.text = "The AI tools needed to spot fraud and unusual patterns already exist and are widely used by banks today."
    r2.font.size = Pt(11.5)
    r2.font.color.rgb = BLACK

    p_f2 = tf_s4_right.add_paragraph()
    p_f2.space_after = Pt(16)
    p_f2.font.name = "Calibri"
    r1 = p_f2.add_run()
    r1.text = "•  Getting good data is hard: "
    r1.font.bold = True
    r1.font.size = Pt(11.5)
    r1.font.color.rgb = BLACK
    r2 = p_f2.add_run()
    r2.text = "The AI is only as smart as the information it gets, so forcing all local government offices to upload clean, digital records will be a major challenge."
    r2.font.size = Pt(11.5)
    r2.font.color.rgb = BLACK

    # Viability
    p_v = tf_s4_right.add_paragraph()
    p_v.text = "Viability"
    p_v.font.name = "Calibri"
    p_v.font.size = Pt(15)
    p_v.font.bold = True
    p_v.font.color.rgb = SUBTITLE_BLUE
    p_v.space_after = Pt(4)

    p_v1 = tf_s4_right.add_paragraph()
    p_v1.space_after = Pt(8)
    p_v1.font.name = "Calibri"
    r1 = p_v1.add_run()
    r1.text = "•  It saves a lot of money: "
    r1.font.bold = True
    r1.font.size = Pt(11.5)
    r1.font.color.rgb = BLACK
    r2 = p_v1.add_run()
    r2.text = "The system will easily pay for itself by stopping wasted funds, fake projects, and contractor corruption."
    r2.font.size = Pt(11.5)
    r2.font.color.rgb = BLACK

    p_v2 = tf_s4_right.add_paragraph()
    p_v2.space_after = Pt(6)
    p_v2.font.name = "Calibri"
    r1 = p_v2.add_run()
    r1.text = "•  People will fight it: "
    r1.font.bold = True
    r1.font.size = Pt(11.5)
    r1.font.color.rgb = BLACK
    r2 = p_v2.add_run()
    r2.text = "Corrupt officials or dishonest contractors who make money off the current broken system will strongly resist using this AI"
    r2.font.size = Pt(11.5)
    r2.font.color.rgb = BLACK

    # =========================================================================
    # SLIDE 5: IMPACT AND BENEFITS (EXACT MATCH TO USER SCREENSHOT)
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    set_white_bg(s5)
    add_header(s5, "IMPACT AND BENEFITS")
    add_bottom_bar(s5, 5)

    # Left text box: Exactly matching screenshot in font, size, line-wrap & indentation
    tb_s5_left = s5.shapes.add_textbox(Inches(0.4), Inches(1.8), Inches(5.6), Inches(5.8))
    tf_s5_left = tb_s5_left.text_frame
    tf_s5_left.word_wrap = True

    s5_data = [
        ("10x Faster Clearances:",
         "Auto-approves low-risk projects in under 48 hours instead of taking 15–30 days."),
        ("Targeted Officer Review:",
         "Uses risk scoring so officials only spend 3–5 minutes reviewing high -risk files."),
        ("Total Forgery Detection:",
         "Scans every single bill and certificate for tampering, leaving no blind spots."),
        ("Prevents Duplicate Funding:",
         "Cross-checks department data to stop the same work from being billed under multiple schemes."),
        ("Continuous Learning:",
         "Updates automatically from officer feedback to catch new fraud patterns.")
    ]

    for idx, (title, desc) in enumerate(s5_data):
        p = tf_s5_left.paragraphs[0] if idx == 0 else tf_s5_left.add_paragraph()
        p.space_after = Pt(10)
        p.font.name = "Calibri"

        # Bullet point
        r_dot = p.add_run()
        r_dot.text = "•  "
        r_dot.font.bold = True
        r_dot.font.size = Pt(14.88)
        r_dot.font.color.rgb = BLACK

        # Title: Calibri Bold 14.88pt
        r_title = p.add_run()
        r_title.text = title + "\n    "
        r_title.font.bold = True
        r_title.font.size = Pt(14.88)
        r_title.font.color.rgb = BLACK

        # Description: Calibri Regular 14.88pt
        r_desc = p.add_run()
        r_desc.text = desc
        r_desc.font.size = Pt(14.88)
        r_desc.font.color.rgb = BLACK

    # Right: Intelligent MPLAD Project Workflow diagram
    img5 = "sih_slides_img/page_5_img_2_Image2.jpg"
    if os.path.exists(img5):
        s5.shapes.add_picture(img5, Inches(6.15), Inches(1.95), width=Inches(4.45), height=Inches(4.85))

    # =========================================================================
    # SLIDE 6: RESEARCH AND REFERENCES
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    set_white_bg(s6)
    add_header(s6, "RESEARCH AND REFERENCES")
    add_bottom_bar(s6, 6)

    # Left text box
    tb_s6_left = s6.shapes.add_textbox(Inches(0.4), Inches(1.8), Inches(5.2), Inches(5.8))
    tf_s6_left = tb_s6_left.text_frame
    tf_s6_left.word_wrap = True

    # Policy section (underlined subtitle in Calibri bold)
    p_pol = tf_s6_left.paragraphs[0]
    p_pol.text = "Policy & government frameworks (2 sources)"
    p_pol.font.name = "Calibri"
    p_pol.font.size = Pt(13)
    p_pol.font.bold = True
    p_pol.font.underline = True
    p_pol.font.color.rgb = SUBTITLE_BLUE
    p_pol.space_after = Pt(6)

    s6_policy = [
        "Right to Public Services (RTS) Act — turnaround benchmarks",
        "MeitY Digital India / e-Governance AI adoption guidelines"
    ]
    for pt in s6_policy:
        p = tf_s6_left.add_paragraph()
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
    p_tech = tf_s6_left.add_paragraph()
    p_tech.space_before = Pt(12)
    p_tech.space_after = Pt(6)
    p_tech.text = "Technical research (2 sources)"
    p_tech.font.name = "Calibri"
    p_tech.font.size = Pt(13)
    p_tech.font.bold = True
    p_tech.font.underline = True
    p_tech.font.color.rgb = SUBTITLE_BLUE

    s6_tech = [
        "CNN-based document forgery detection (ELA methods)",
        "SHAP — SHapley Additive exPlanations, explainability framework"
    ]
    for pt in s6_tech:
        p = tf_s6_left.add_paragraph()
        p.space_after = Pt(5)
        p.font.name = "Calibri"
        r_dot = p.add_run()
        r_dot.text = "•  "
        r_dot.font.bold = True
        r_dot.font.size = Pt(11.5)
        r_dot.font.color.rgb = BLACK
        r_txt = p.add_run()
        r_txt.text = pt
        r_txt.font.name = "Calibri"
        r_txt.font.size = Pt(11.5)
        r_txt.font.color.rgb = BLACK

    # Prototype & Live Links section
    p_proto = tf_s6_left.add_paragraph()
    p_proto.space_before = Pt(12)
    p_proto.space_after = Pt(6)
    p_proto.text = "Prototype & Live Deployment"
    p_proto.font.name = "Calibri"
    p_proto.font.size = Pt(13)
    p_proto.font.bold = True
    p_proto.font.underline = True
    p_proto.font.color.rgb = SUBTITLE_BLUE

    s6_links = [
        ("Live Prototype: ", "https://printed-blind-lil-arch.trycloudflare.com", "https://printed-blind-lil-arch.trycloudflare.com"),
        ("Source Code (GitHub): ", "https://github.com/kushalshahbtech2025-coder/autogov", "https://github.com/kushalshahbtech2025-coder/autogov")
    ]
    for lbl, val, url in s6_links:
        p = tf_s6_left.add_paragraph()
        p.space_after = Pt(5)
        p.font.name = "Calibri"

        r_dot = p.add_run()
        r_dot.text = "•  "
        r_dot.font.name = "Arial"
        r_dot.font.bold = True
        r_dot.font.size = Pt(11.5)
        r_dot.font.color.rgb = BLACK

        r_lbl = p.add_run()
        r_lbl.text = lbl
        r_lbl.font.name = "Calibri"
        r_lbl.font.bold = True
        r_lbl.font.size = Pt(11.5)
        r_lbl.font.color.rgb = BLACK

        r_txt = p.add_run()
        r_txt.text = val
        r_txt.font.name = "Calibri"
        r_txt.font.size = Pt(11.5)
        r_txt.font.bold = True
        r_txt.font.underline = True
        r_txt.font.color.rgb = RGBColor(0, 102, 204)
        r_txt.hyperlink.address = url

    # Right: END TO END WORKFLOW badge & diagram
    tb_badge = s6.shapes.add_textbox(Inches(5.7), Inches(1.8), Inches(4.8), Inches(0.4))
    tf_badge = tb_badge.text_frame
    p_b = tf_badge.paragraphs[0]
    p_b.text = "END TO END WORKFLOW"
    p_b.font.name = "Calibri"
    p_b.font.size = Pt(13)
    p_b.font.bold = True
    p_b.font.color.rgb = WHITE
    tb_badge.fill.solid()
    tb_badge.fill.fore_color.rgb = RGBColor(0, 102, 128)

    img6 = "sih_slides_img/page_6_img_2_Image2.jpg"
    if os.path.exists(img6):
        s6.shapes.add_picture(img6, Inches(5.7), Inches(2.4), width=Inches(4.9), height=Inches(4.8))

    # Add Speaker notes to all slides
    s1.notes_slide.notes_text_frame.text = "Welcome judges to AutoGov+ presentation. Team Innova8 (T049), Problem Statement SIH26102. Live demo available at: https://printed-blind-lil-arch.trycloudflare.com"
    s2.notes_slide.notes_text_frame.text = "Addressing the issue: Manual challenges take 15-30 days, caseworker fatigue, no cross-department fraud checks. AutoGov+ brings auto-decision in seconds, 100% forgery scanning, and automated judgment."
    s3.notes_slide.notes_text_frame.text = "Technical Approach: React PWA, FastAPI/Express, PyTorch CNN ELA, XGBoost, FAISS, SHAP explainable AI, and strict AES-256 with TLS 1.3. Live demo: https://printed-blind-lil-arch.trycloudflare.com"
    s4.notes_slide.notes_text_frame.text = "Feasibility & Viability: Technology is proven, data noise handled via OpenCV preprocessing, saves public funds, empowers caseworkers via Human-in-the-Loop Cockpit."
    s5.notes_slide.notes_text_frame.text = "Impact & Benefits: 10x faster clearances, 3-5 minute targeted officer reviews, 100% forgery detection, duplicate funding prevention, continuous active learning."
    s6.notes_slide.notes_text_frame.text = "Research & References: RTS Act, DPDP Act 2023, MeitY guidelines, CNN ELA, and SHAP explainability. Live demo: https://printed-blind-lil-arch.trycloudflare.com"

    # =========================================================================
    # ENFORCE EXACT TEMPLATE FONTS ACROSS ALL RUNS
    # =========================================================================
    title_phrases = [
        "SMART INDIA HACKATHON 2025",
        "TITLE PAGE",
        "ADDRESSING THE ISSUE",
        "TECHNICAL APPROACH",
        "TECHNICAL STACK",
        "FEASIBILITY AND VIABILITY",
        "IMPACT AND BENEFITS",
        "RESEARCH AND REFERENCES"
    ]

    for slide in prs.slides:
        for shape in slide.shapes:
            if shape.has_text_frame:
                for p in shape.text_frame.paragraphs:
                    p_text = p.text.strip()
                    is_title = any(tp in p_text for tp in title_phrases) or (p.font.name == "Times New Roman")
                    for r in p.runs:
                        if "•" in r.text:
                            r.font.name = "Arial"
                        elif is_title or r.font.name == "Times New Roman":
                            r.font.name = "Times New Roman"
                        else:
                            r.font.name = "Calibri"

    # Save to candidate filenames (handling any file locked by PowerPoint/Office viewer)
    target_filenames = [
        "AutoGov_SIH_Final.pptx",
        "AutoGov_SIH_Submission.pptx",
        "AutoGov_SIH_Template_Exact.pptx",
        "AutoGov_SIH_Presentation.pptx"
    ]
    saved_files = []
    for fname in target_filenames:
        try:
            prs.save(fname)
            saved_files.append(os.path.abspath(fname))
            print(f"Successfully saved: {os.path.abspath(fname)}")
        except Exception as e:
            print(f"Could not overwrite {fname} (likely currently open in PowerPoint): {e}")

    if not saved_files:
        alt_name = "AutoGov_SIH_Generated_v2.pptx"
        prs.save(alt_name)
        print(f"Saved to fallback: {os.path.abspath(alt_name)}")

if __name__ == "__main__":
    create_perfect_presentation()
