import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def build_presentation(output_pptx="AutoGov_SIH_2026_Submission.pptx"):
    prs = Presentation()
    # 16:9 Widescreen (13.333 x 7.5 inches = 960 x 540 pt)
    prs.slide_width = Inches(13.333333)
    prs.slide_height = Inches(7.5)

    blank_layout = prs.slide_layouts[6]

    # Theme Colors matching SIH2026-2.pdf
    WHITE = RGBColor(255, 255, 255)
    BLACK = RGBColor(0, 0, 0)
    DARK_RED = RGBColor(151, 56, 53)       # #973835 (Primary Maroon/Red-Brown)
    SOFT_RED = RGBColor(200, 122, 118)     # #C87A76 (Banner Salmon/Pink)
    LIGHT_BG_RED = RGBColor(253, 245, 245) # Soft card background
    LIGHT_BORDER = RGBColor(220, 180, 180) # Card outline
    TEXT_DARK = RGBColor(33, 37, 41)       # #212529 Dark charcoal
    MUTED_TEXT = RGBColor(100, 100, 100)
    GREEN_ACCENT = RGBColor(35, 135, 65)
    BLUE_ACCENT = RGBColor(35, 95, 175)

    # Assets with clean pure white backgrounds (composited with actual PDF alpha masks)
    IMG_SIH_LOGO = "sih2026_2_extracted_img/sih_logo_perfect_white.png"
    IMG_BULB = "sih2026_2_extracted_img/bulb_perfect_white.png"
    IMG_TEAM_LOGO = "sih2026_2_extracted_img/team_logo_circle_clean.png"

    # Slide 2 icons
    ICON_PHONE = "sih2026_2_extracted_img/icon_phone.png"
    ICON_AI = "sih2026_2_extracted_img/icon_ai.png"
    ICON_MEASURE = "sih2026_2_extracted_img/icon_measure.png"
    ICON_REPORT = "sih2026_2_extracted_img/icon_report.png"

    def set_white_bg(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = WHITE
        bg.line.fill.background()
        return bg

    def add_header(slide, title_text, has_team_logo=True):
        if has_team_logo and os.path.exists(IMG_TEAM_LOGO):
            slide.shapes.add_picture(IMG_TEAM_LOGO, Inches(0.18), Inches(0.08), width=Inches(1.15), height=Inches(1.15))

        if os.path.exists(IMG_SIH_LOGO):
            slide.shapes.add_picture(IMG_SIH_LOGO, Inches(10.7), Inches(0.08), width=Inches(2.45), height=Inches(1.15))

        # Title
        tb = slide.shapes.add_textbox(Inches(1.5), Inches(0.2), Inches(9.0), Inches(0.65))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title_text
        p.font.name = "Calibri"
        p.font.size = Pt(34)
        p.font.bold = True
        p.font.color.rgb = DARK_RED
        p.alignment = PP_ALIGN.CENTER

    def add_bottom_bar(slide, page_num_str):
        # Bottom red-brown banner
        bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, Inches(6.96), Inches(13.333333), Inches(0.54))
        bar.fill.solid()
        bar.fill.fore_color.rgb = DARK_RED
        bar.line.fill.background()

        # Page number
        tb_num = slide.shapes.add_textbox(Inches(12.3), Inches(7.02), Inches(0.8), Inches(0.45))
        tf_num = tb_num.text_frame
        p_num = tf_num.paragraphs[0]
        p_num.text = str(page_num_str)
        p_num.font.name = "Calibri"
        p_num.font.size = Pt(12)
        p_num.font.bold = True
        p_num.font.color.rgb = WHITE
        p_num.alignment = PP_ALIGN.RIGHT

    # =========================================================================
    # SLIDE 1: TITLE PAGE
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    set_white_bg(s1)

    # Top Right SIH Logo
    if os.path.exists(IMG_SIH_LOGO):
        s1.shapes.add_picture(IMG_SIH_LOGO, Inches(10.7), Inches(0.08), width=Inches(2.45), height=Inches(1.15))

    # Top Centered Title
    tb_s1_title = s1.shapes.add_textbox(Inches(1.5), Inches(0.35), Inches(9.0), Inches(0.75))
    tf_s1_title = tb_s1_title.text_frame
    p_s1_title = tf_s1_title.paragraphs[0]
    p_s1_title.text = "SMART INDIA HACKATHON 2026"
    p_s1_title.font.name = "Calibri"
    p_s1_title.font.size = Pt(38)
    p_s1_title.font.bold = True
    p_s1_title.font.color.rgb = DARK_RED
    p_s1_title.alignment = PP_ALIGN.CENTER

    # Left bullet list (pre-filled according to project, easy for user to edit)
    tb_s1_left = s1.shapes.add_textbox(Inches(0.45), Inches(1.5), Inches(7.3), Inches(5.2))
    tf_s1_left = tb_s1_left.text_frame
    tf_s1_left.word_wrap = True

    bullets_s1 = [
        ("Problem Statement ID – ", "SIH26102"),
        ("Problem Statement Title- ", "AI-powered system to detect anomalies, fraud, and inefficiencies in MPLAD Scheme implementation and e-Governance."),
        ("Theme- ", "Smart Governance & Smart Automation"),
        ("PS Category- ", "Software"),
        ("Team ID- ", "T049"),
        ("Team Name - ", "Team Innova8 (AutoGov+)")
    ]

    for idx, (label, val) in enumerate(bullets_s1):
        p = tf_s1_left.paragraphs[0] if idx == 0 else tf_s1_left.add_paragraph()
        p.space_after = Pt(16)
        p.font.name = "Calibri"

        # Bullet symbol
        r_bullet = p.add_run()
        r_bullet.text = "•  "
        r_bullet.font.bold = True
        r_bullet.font.size = Pt(16)
        r_bullet.font.color.rgb = BLACK

        # Label
        r_label = p.add_run()
        r_label.text = label
        r_label.font.bold = True
        r_label.font.size = Pt(16)
        r_label.font.color.rgb = BLACK

        # Value
        r_val = p.add_run()
        r_val.text = val
        r_val.font.bold = False
        r_val.font.size = Pt(16)
        r_val.font.color.rgb = TEXT_DARK

    # Center-Right Bulb Graphic (Clean on white)
    if os.path.exists(IMG_BULB):
        s1.shapes.add_picture(IMG_BULB, Inches(8.0), Inches(2.0), width=Inches(4.1), height=Inches(4.5))

    # Bottom bar (no page number on slide 1, matching template)
    bar1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, Inches(6.96), Inches(13.333333), Inches(0.54))
    bar1.fill.solid()
    bar1.fill.fore_color.rgb = DARK_RED
    bar1.line.fill.background()

    # =========================================================================
    # SLIDE 2: AUTOGOV+ / OUR SOLUTION & COMPARISON
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    set_white_bg(s2)
    add_bottom_bar(s2, "2")

    if os.path.exists(IMG_TEAM_LOGO):
        s2.shapes.add_picture(IMG_TEAM_LOGO, Inches(0.18), Inches(0.08), width=Inches(1.15), height=Inches(1.15))
    if os.path.exists(IMG_SIH_LOGO):
        s2.shapes.add_picture(IMG_SIH_LOGO, Inches(10.7), Inches(0.08), width=Inches(2.45), height=Inches(1.15))

    # Title: AUTOGOV+
    tb_s2_title = s2.shapes.add_textbox(Inches(2.0), Inches(0.05), Inches(8.5), Inches(0.55))
    tf_s2_title = tb_s2_title.text_frame
    p2_title = tf_s2_title.paragraphs[0]
    p2_title.text = "AUTOGOV+"
    p2_title.font.name = "Calibri"
    p2_title.font.size = Pt(34)
    p2_title.font.bold = True
    p2_title.font.color.rgb = DARK_RED
    p2_title.alignment = PP_ALIGN.CENTER

    # Subtitle
    tb_s2_sub = s2.shapes.add_textbox(Inches(1.5), Inches(0.58), Inches(9.5), Inches(0.45))
    tf_s2_sub = tb_s2_sub.text_frame
    p2_sub = tf_s2_sub.paragraphs[0]
    p2_sub.text = "AI-Powered Automated Document Verification & Adjudication for e-Governance & MPLAD"
    p2_sub.font.name = "Calibri"
    p2_sub.font.size = Pt(17)
    p2_sub.font.bold = True
    p2_sub.font.color.rgb = DARK_RED
    p2_sub.alignment = PP_ALIGN.CENTER

    # Left: "Our Solution" Banner Box
    banner_sol = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.4), Inches(1.15), Inches(6.0), Inches(0.5))
    banner_sol.fill.solid()
    banner_sol.fill.fore_color.rgb = SOFT_RED
    banner_sol.line.color.rgb = DARK_RED
    banner_sol.line.width = Pt(1)
    tf_bs = banner_sol.text_frame
    tf_bs.vertical_anchor = MSO_ANCHOR.MIDDLE
    p_bs = tf_bs.paragraphs[0]
    p_bs.text = "Our Solution"
    p_bs.font.name = "Calibri"
    p_bs.font.size = Pt(20)
    p_bs.font.bold = True
    p_bs.font.color.rgb = WHITE
    p_bs.alignment = PP_ALIGN.CENTER

    # Left 4 Feature Cards with extracted icons
    sol_features = [
        (ICON_PHONE, "Mobile & Web Officer Cockpit", "Responsive PWA for verification caseworkers with live camera ingestion & split-screen adjudication."),
        (ICON_AI, "Multi-Document Geometric AI", "Deep geometric OCR & seal validation across certificates, invoices & NOCs, not single-image verdicts."),
        (ICON_MEASURE, "Pixel-Level CNN Forgery Engine", "PyTorch Error Level Analysis (ELA) detects spliced text, altered amounts, and forged digital stamps."),
        (ICON_REPORT, "Explainable Adjudication & QR Trail", "Generates court-admissible SHAP waterfall reports, tamper-proof logs, and QR-verifiable certificates.")
    ]

    for i, (icon_path, f_title, f_desc) in enumerate(sol_features):
        top_pos = Inches(1.78 + i * 0.7)
        # Place icon
        if os.path.exists(icon_path):
            s2.shapes.add_picture(icon_path, Inches(0.42), top_pos + Inches(0.04), width=Inches(0.48), height=Inches(0.48))
        else:
            dot = s2.shapes.add_shape(MSO_SHAPE.OVAL, Inches(0.45), top_pos + Inches(0.06), Inches(0.24), Inches(0.24))
            dot.fill.solid()
            dot.fill.fore_color.rgb = DARK_RED
            dot.line.fill.background()

        tb_feat = s2.shapes.add_textbox(Inches(1.0), top_pos, Inches(5.4), Inches(0.68))
        tf_feat = tb_feat.text_frame
        tf_feat.word_wrap = True
        tf_feat.margin_top = Inches(0)
        p_feat = tf_feat.paragraphs[0]
        
        r_ft = p_feat.add_run()
        r_ft.text = f_title + ": "
        r_ft.font.name = "Calibri"
        r_ft.font.bold = True
        r_ft.font.size = Pt(12)
        r_ft.font.color.rgb = DARK_RED

        r_fd = p_feat.add_run()
        r_fd.text = f_desc
        r_fd.font.name = "Calibri"
        r_fd.font.size = Pt(11)
        r_fd.font.color.rgb = TEXT_DARK

    # Right: "Problem today" vs "How our solution fixes it" Matrix
    table_shape = s2.shapes.add_table(5, 2, Inches(6.7), Inches(1.15), Inches(6.2), Inches(3.4))
    table = table_shape.table
    table.columns[0].width = Inches(2.9)
    table.columns[1].width = Inches(3.3)

    # Header Row
    cell_p = table.cell(0, 0)
    cell_p.fill.solid()
    cell_p.fill.fore_color.rgb = LIGHT_BG_RED
    cell_p.text = "Problem today"
    for p in cell_p.text_frame.paragraphs:
        p.font.name = "Calibri"
        p.font.bold = True
        p.font.size = Pt(13)
        p.font.color.rgb = DARK_RED

    cell_s = table.cell(0, 1)
    cell_s.fill.solid()
    cell_s.fill.fore_color.rgb = LIGHT_BG_RED
    cell_s.text = "How our solution fixes it"
    for p in cell_s.text_frame.paragraphs:
        p.font.name = "Calibri"
        p.font.bold = True
        p.font.size = Pt(13)
        p.font.color.rgb = DARK_RED

    rows_data = [
        ("Inconsistent manual grading & 15-30 day casework backlog", "Instant automated triage: 82% clean dossiers auto-cleared in <4.8s"),
        ("Spliced signatures & altered figures slip through undetected", "PyTorch ELA CNN detects pixel-level tampering & unauthorized edits"),
        ("Cross-scheme duplicate billing & ghost contractors drain funds", "FAISS vector matching flags duplicate invoices across state & MPLAD funds"),
        ("Black-box AI rejections leave citizens without legal explanation", "Transparent SHAP waterfall feature attributions with downloadable QR audit trail")
    ]

    for r_idx, (prob, fix) in enumerate(rows_data):
        c_prob = table.cell(r_idx + 1, 0)
        c_prob.fill.solid()
        c_prob.fill.fore_color.rgb = WHITE if r_idx % 2 == 0 else LIGHT_BG_RED
        c_prob.text = prob
        for p in c_prob.text_frame.paragraphs:
            p.font.name = "Calibri"
            p.font.size = Pt(11)
            p.font.color.rgb = TEXT_DARK

        c_fix = table.cell(r_idx + 1, 1)
        c_fix.fill.solid()
        c_fix.fill.fore_color.rgb = WHITE if r_idx % 2 == 0 else LIGHT_BG_RED
        c_fix.text = fix
        for p in c_fix.text_frame.paragraphs:
            p.font.name = "Calibri"
            p.font.size = Pt(11)
            p.font.color.rgb = DARK_RED

    # Bottom: 5 Workflow Steps (Cards matching template)
    steps_s2 = [
        ("1", "Capture / Ingest", "Citizen or caseworker uploads documents via camera/scanner with auto-deskewing"),
        ("2", "OCR & Geometry", "Zero-PII bounding box alignment & statutory document layout verification"),
        ("3", "Detect & Deduplicate", "PyTorch ELA CNN spots tampering; FAISS checks cross-scheme duplicate claims"),
        ("4", "Risk Scoring", "XGBoost ensemble classifies risk (0-100): Auto-Clear vs Officer Scrutiny"),
        ("5", "Adjudication & QR", "Explainable SHAP report generated with verifiable digital clearance QR code")
    ]

    card_width = Inches(2.4)
    card_gap = Inches(0.12)
    start_x = Inches(0.4)
    card_top = Inches(4.75)
    card_height = Inches(2.05)

    for idx, (num, stitle, sdesc) in enumerate(steps_s2):
        cx = start_x + idx * (card_width + card_gap)
        card = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, card_top, card_width, card_height)
        card.fill.solid()
        card.fill.fore_color.rgb = LIGHT_BG_RED
        card.line.color.rgb = DARK_RED
        card.line.width = Pt(1)

        # Header Pill inside Card
        pill = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx + Inches(0.1), card_top + Inches(0.1), card_width - Inches(0.2), Inches(0.42))
        pill.fill.solid()
        pill.fill.fore_color.rgb = SOFT_RED
        pill.line.fill.background()
        tf_pill = pill.text_frame
        p_pill = tf_pill.paragraphs[0]
        p_pill.text = f"{num}. {stitle}"
        p_pill.font.name = "Calibri"
        p_pill.font.bold = True
        p_pill.font.size = Pt(11)
        p_pill.font.color.rgb = WHITE
        p_pill.alignment = PP_ALIGN.CENTER

        # Body text
        tb_card = s2.shapes.add_textbox(cx + Inches(0.1), card_top + Inches(0.55), card_width - Inches(0.2), Inches(1.4))
        tf_card = tb_card.text_frame
        tf_card.word_wrap = True
        p_body = tf_card.paragraphs[0]
        p_body.text = sdesc
        p_body.font.name = "Calibri"
        p_body.font.size = Pt(10.5)
        p_body.font.color.rgb = TEXT_DARK
        p_body.alignment = PP_ALIGN.CENTER

    # =========================================================================
    # SLIDE 3: TECHNICAL APPROACH
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    set_white_bg(s3)
    add_header(s3, "TECHNICAL APPROACH")
    add_bottom_bar(s3, "3")

    # Left Column: Tech Stack
    tb_ts_lbl = s3.shapes.add_textbox(Inches(0.4), Inches(1.15), Inches(2.8), Inches(0.4))
    tf_ts_lbl = tb_ts_lbl.text_frame
    p_ts_lbl = tf_ts_lbl.paragraphs[0]
    p_ts_lbl.text = "Tech Stack -"
    p_ts_lbl.font.name = "Calibri"
    p_ts_lbl.font.size = Pt(20)
    p_ts_lbl.font.bold = True
    p_ts_lbl.font.color.rgb = BLACK

    tech_items = [
        ("React 19 / TypeScript", "Officer Dashboard & Citizen PWA"),
        ("FastAPI / Python", "Pipeline Ingestion REST Orchestration"),
        ("OpenCV", "Geometric Deskew & Stamp Alignment"),
        ("PyTorch (ELA CNN)", "Pixel-Level Document Forgery Detection"),
        ("XGBoost", "Multi-Signal Adjudication Risk Engine"),
        ("FAISS / SBERT", "Sub-second Cross-Scheme Deduplication"),
        ("PostgreSQL", "DPI Registry & Tamper-Proof Audit DB"),
        ("SHAP", "Court-Admissible Explainable AI Waterfall")
    ]

    for idx, (tname, tdesc) in enumerate(tech_items):
        item_top = Inches(1.6 + idx * 0.65)
        item_box = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.4), item_top, Inches(2.7), Inches(0.58))
        item_box.fill.solid()
        item_box.fill.fore_color.rgb = LIGHT_BG_RED
        item_box.line.color.rgb = DARK_RED
        item_box.line.width = Pt(1)
        
        tf_ib = item_box.text_frame
        tf_ib.word_wrap = True
        tf_ib.margin_top = Inches(0.04)
        p_it = tf_ib.paragraphs[0]
        p_it.text = tname
        p_it.font.name = "Calibri"
        p_it.font.bold = True
        p_it.font.size = Pt(11)
        p_it.font.color.rgb = DARK_RED

        p_id = tf_ib.add_paragraph()
        p_id.text = tdesc
        p_id.font.name = "Calibri"
        p_id.font.size = Pt(9.5)
        p_id.font.color.rgb = MUTED_TEXT

    # Center & Right: 2 Technical Approaches + Final Output
    # Box for Approach 1: Document Computer Vision
    app1_box = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(3.3), Inches(1.2), Inches(6.8), Inches(2.65))
    app1_box.fill.solid()
    app1_box.fill.fore_color.rgb = WHITE
    app1_box.line.color.rgb = BLUE_ACCENT
    app1_box.line.width = Pt(1.5)

    # Approach 1 Title Banner
    a1_banner = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(3.45), Inches(1.3), Inches(6.5), Inches(0.45))
    a1_banner.fill.solid()
    a1_banner.fill.fore_color.rgb = BLUE_ACCENT
    a1_banner.line.fill.background()
    tf_a1b = a1_banner.text_frame
    p_a1b = tf_a1b.paragraphs[0]
    p_a1b.text = "1   Approach 1 – Document Computer Vision & Geometry Analysis"
    p_a1b.font.name = "Calibri"
    p_a1b.font.bold = True
    p_a1b.font.size = Pt(13)
    p_a1b.font.color.rgb = WHITE

    a1_steps = [
        ("Input Normalization", "Auto-deskewing, contrast enhancement & unsharp masking of mobile uploads"),
        ("ELA CNN Forgery Check", "Pixel-level Error Level Analysis detecting cut-paste signatures & modified text"),
        ("Zero-PII Geometry Match", "Aligns official seals and bounding boxes against statutory scheme templates"),
        ("Geometric Verdict", "Instant label: Clean authentic layout vs Spliced/Forged anomaly")
    ]
    for s_idx, (stitle, sdet) in enumerate(a1_steps):
        step_x = Inches(3.45 + s_idx * 1.62)
        sbox = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, step_x, Inches(1.85), Inches(1.55), Inches(1.85))
        sbox.fill.solid()
        sbox.fill.fore_color.rgb = RGBColor(240, 246, 255)
        sbox.line.color.rgb = BLUE_ACCENT
        sbox.line.width = Pt(1)

        tf_sb = sbox.text_frame
        tf_sb.word_wrap = True
        p_st = tf_sb.paragraphs[0]
        p_st.text = stitle
        p_st.font.name = "Calibri"
        p_st.font.bold = True
        p_st.font.size = Pt(11)
        p_st.font.color.rgb = BLUE_ACCENT
        p_st.alignment = PP_ALIGN.CENTER

        p_sd = tf_sb.add_paragraph()
        p_sd.text = sdet
        p_sd.font.name = "Calibri"
        p_sd.font.size = Pt(9.5)
        p_sd.font.color.rgb = TEXT_DARK
        p_sd.alignment = PP_ALIGN.CENTER

    # Box for Approach 2: Cross-Scheme Intelligence & Deduplication
    app2_box = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(3.3), Inches(4.05), Inches(6.8), Inches(2.65))
    app2_box.fill.solid()
    app2_box.fill.fore_color.rgb = WHITE
    app2_box.line.color.rgb = GREEN_ACCENT
    app2_box.line.width = Pt(1.5)

    # Approach 2 Title Banner
    a2_banner = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(3.45), Inches(4.15), Inches(6.5), Inches(0.45))
    a2_banner.fill.solid()
    a2_banner.fill.fore_color.rgb = GREEN_ACCENT
    a2_banner.line.fill.background()
    tf_a2b = a2_banner.text_frame
    p_a2b = tf_a2b.paragraphs[0]
    p_a2b.text = "2   Approach 2 – Cross-Scheme Semantic Matching & Deduplication"
    p_a2b.font.name = "Calibri"
    p_a2b.font.bold = True
    p_a2b.font.size = Pt(13)
    p_a2b.font.color.rgb = WHITE

    a2_steps = [
        ("DPI Data Ingestion", "Extracts contractor GSTN, project coordinates & invoice line items via API"),
        ("SBERT Dense Embeddings", "Sentence-Transformers generate 384-dim semantic representations of contracts"),
        ("FAISS Vector Index", "Sub-millisecond cosine search across municipal, state & MPLAD registries"),
        ("Deduplication Output", "Catches duplicate billing, ghost contractors, and overlapping project sites")
    ]
    for s_idx, (stitle, sdet) in enumerate(a2_steps):
        step_x = Inches(3.45 + s_idx * 1.62)
        sbox = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, step_x, Inches(4.7), Inches(1.55), Inches(1.85))
        sbox.fill.solid()
        sbox.fill.fore_color.rgb = RGBColor(240, 253, 244)
        sbox.line.color.rgb = GREEN_ACCENT
        sbox.line.width = Pt(1)

        tf_sb = sbox.text_frame
        tf_sb.word_wrap = True
        p_st = tf_sb.paragraphs[0]
        p_st.text = stitle
        p_st.font.name = "Calibri"
        p_st.font.bold = True
        p_st.font.size = Pt(11)
        p_st.font.color.rgb = GREEN_ACCENT
        p_st.alignment = PP_ALIGN.CENTER

        p_sd = tf_sb.add_paragraph()
        p_sd.text = sdet
        p_sd.font.name = "Calibri"
        p_sd.font.size = Pt(9.5)
        p_sd.font.color.rgb = TEXT_DARK
        p_sd.alignment = PP_ALIGN.CENTER

    # Right Box: Final Output & Adjudication Cockpit
    out_box = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(10.3), Inches(1.2), Inches(2.7), Inches(5.5))
    out_box.fill.solid()
    out_box.fill.fore_color.rgb = LIGHT_BG_RED
    out_box.line.color.rgb = DARK_RED
    out_box.line.width = Pt(1.5)

    # Final Output Title
    ob_banner = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(10.45), Inches(1.35), Inches(2.4), Inches(0.45))
    ob_banner.fill.solid()
    ob_banner.fill.fore_color.rgb = DARK_RED
    ob_banner.line.fill.background()
    tf_obb = ob_banner.text_frame
    p_obb = tf_obb.paragraphs[0]
    p_obb.text = "Final Output: Officer Cockpit"
    p_obb.font.name = "Calibri"
    p_obb.font.bold = True
    p_obb.font.size = Pt(12)
    p_obb.font.color.rgb = WHITE
    p_obb.alignment = PP_ALIGN.CENTER

    out_items = [
        ("Risk Scoring Gauge (0–100)", "Predictive risk probability based on 14 weighted document integrity signals."),
        ("Explainable SHAP Waterfall", "Positive and negative feature contributions explaining why any case was flagged."),
        ("Split-Screen Review", "Original document vs ELA heatmaps with bounding boxes highlighting anomalies."),
        ("Batch Decision Engine", "Autonomous bulk-clearance for clean cases (risk < 20); targeted scrutiny for outliers."),
        ("Verifiable Digital Clearance", "Instant digitally stamped approval certificate with tamper-proof QR code.")
    ]

    for o_idx, (otitle, odesc) in enumerate(out_items):
        obox = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(10.45), Inches(1.95 + o_idx * 0.9), Inches(2.4), Inches(0.82))
        obox.fill.solid()
        obox.fill.fore_color.rgb = WHITE
        obox.line.color.rgb = DARK_RED
        obox.line.width = Pt(1)

        tf_ob = obox.text_frame
        tf_ob.word_wrap = True
        tf_ob.margin_top = Inches(0.04)
        p_ot = tf_ob.paragraphs[0]
        p_ot.text = otitle
        p_ot.font.name = "Calibri"
        p_ot.font.bold = True
        p_ot.font.size = Pt(10.5)
        p_ot.font.color.rgb = DARK_RED

        p_od = tf_ob.add_paragraph()
        p_od.text = odesc
        p_od.font.name = "Calibri"
        p_od.font.size = Pt(9.5)
        p_od.font.color.rgb = TEXT_DARK

    # =========================================================================
    # SLIDE 4: FEASIBILITY AND VIABILITY
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    set_white_bg(s4)
    add_header(s4, "FEASIBILITY AND VIABILITY")
    add_bottom_bar(s4, "4")

    # Top Subtitle Banners (clean placement with zero overlap)
    # Left banner
    tb_s4_b1 = s4.shapes.add_textbox(Inches(1.4), Inches(0.95), Inches(5.1), Inches(0.65))
    tf_s4_b1 = tb_s4_b1.text_frame
    tf_s4_b1.word_wrap = True
    p_b1 = tf_s4_b1.paragraphs[0]
    p_b1.text = "A production-ready, lightweight e-governance engine designed for immediate plug-and-play integration with state citizen portals and MPLADS monitoring dashboards."
    p_b1.font.name = "Calibri"
    p_b1.font.size = Pt(11)
    p_b1.font.color.rgb = TEXT_DARK

    # Right banner
    tb_s4_b2 = s4.shapes.add_textbox(Inches(6.8), Inches(0.95), Inches(3.8), Inches(0.65))
    tf_s4_b2 = tb_s4_b2.text_frame
    tf_s4_b2.word_wrap = True
    p_b2 = tf_s4_b2.paragraphs[0]
    p_b2.text = "Technically feasible, high-throughput pipeline operating at < ₹2.50 per clearance, slashing administrative turnaround from 25 days to under 5 seconds."
    p_b2.font.name = "Calibri"
    p_b2.font.size = Pt(11)
    p_b2.font.color.rgb = TEXT_DARK

    # Panel 1: Technical Feasibility
    p1_card = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.4), Inches(1.72), Inches(3.7), Inches(5.08))
    p1_card.fill.solid()
    p1_card.fill.fore_color.rgb = RGBColor(245, 250, 255)
    p1_card.line.color.rgb = BLUE_ACCENT
    p1_card.line.width = Pt(1.5)

    p1_title = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.55), Inches(1.85), Inches(3.4), Inches(0.42))
    p1_title.fill.solid()
    p1_title.fill.fore_color.rgb = BLUE_ACCENT
    p1_title.line.fill.background()
    tf_p1t = p1_title.text_frame
    p_p1t = tf_p1t.paragraphs[0]
    p_p1t.text = "Technical Feasibility"
    p_p1t.font.name = "Calibri"
    p_p1t.font.bold = True
    p_p1t.font.size = Pt(13)
    p_p1t.font.color.rgb = WHITE
    p_p1t.alignment = PP_ALIGN.CENTER

    tf_feas = s4.shapes.add_textbox(Inches(0.55), Inches(2.38), Inches(3.4), Inches(4.3)).text_frame
    tf_feas.word_wrap = True
    feas_bullets = [
        ("Document CV & Landmark Geometry", "Robust against smartphone camera angles, shadows, and low-light artifacts via adaptive OpenCV thresholding."),
        ("Lightweight & Deployable ML", "PyTorch CNN & XGBoost quantized models execute under 250ms per page on standard CPU servers—no expensive GPU farms needed."),
        ("High-Throughput Enterprise API", "FastAPI microservices support 100+ concurrent document submissions with Redis queue caching and PostgreSQL replication."),
        ("Zero-PII Compliance Architecture", "Adheres to DPDP Act 2023 & UIDAI rules; processes spatial geometry without persistent storage of citizen biometrics.")
    ]
    for idx, (head, desc) in enumerate(feas_bullets):
        p = tf_feas.paragraphs[0] if idx == 0 else tf_feas.add_paragraph()
        p.space_after = Pt(8)
        r_h = p.add_run()
        r_h.text = f"• {head}: "
        r_h.font.name = "Calibri"
        r_h.font.bold = True
        r_h.font.size = Pt(11)
        r_h.font.color.rgb = BLUE_ACCENT
        r_d = p.add_run()
        r_d.text = desc
        r_d.font.name = "Calibri"
        r_d.font.size = Pt(10)
        r_d.font.color.rgb = TEXT_DARK

    # Panel 2: Potential Risks vs Strategies to Overcome (Center Column)
    p2_card = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(4.3), Inches(1.72), Inches(4.8), Inches(5.08))
    p2_card.fill.solid()
    p2_card.fill.fore_color.rgb = WHITE
    p2_card.line.color.rgb = DARK_RED
    p2_card.line.width = Pt(1.5)

    p2_title = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(4.45), Inches(1.85), Inches(4.5), Inches(0.42))
    p2_title.fill.solid()
    p2_title.fill.fore_color.rgb = DARK_RED
    p2_title.line.fill.background()
    tf_p2t = p2_title.text_frame
    p_p2t = tf_p2t.paragraphs[0]
    p_p2t.text = "Potential Risks & Mitigation Strategies"
    p_p2t.font.name = "Calibri"
    p_p2t.font.bold = True
    p_p2t.font.size = Pt(13)
    p_p2t.font.color.rgb = WHITE
    p_p2t.alignment = PP_ALIGN.CENTER

    risk_mitigations = [
        ("Noisy/Blurred uploads", "Automated OpenCV pipeline deskews, denoises, and auto-enhances contrast prior to ML ingestion."),
        ("Novel forgery variants", "Multi-modal verification: combines ELA compression noise, font geometry, and seal cross-verification."),
        ("Caseworker resistance", "Intuitive split-screen Cockpit with plain-English SHAP explanations—AI assists officers, never overrides."),
        ("Format changes across states", "Configurable YAML rule engine allows local district administrators to update template rules instantly.")
    ]

    for idx, (risk, strat) in enumerate(risk_mitigations):
        top_y = Inches(2.42 + idx * 1.05)
        # Risk Box
        rbox = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(4.45), top_y, Inches(2.15), Inches(0.95))
        rbox.fill.solid()
        rbox.fill.fore_color.rgb = RGBColor(254, 242, 242)
        rbox.line.color.rgb = DARK_RED
        rbox.line.width = Pt(1)
        tf_rb = rbox.text_frame
        tf_rb.word_wrap = True
        tf_rb.margin_top = Inches(0.04)
        p_rh = tf_rb.paragraphs[0]
        p_rh.text = f"Risk: {risk}"
        p_rh.font.name = "Calibri"
        p_rh.font.bold = True
        p_rh.font.size = Pt(10)
        p_rh.font.color.rgb = DARK_RED

        # Strategy Box
        sbox = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.75), top_y, Inches(2.2), Inches(0.95))
        sbox.fill.solid()
        sbox.fill.fore_color.rgb = RGBColor(240, 253, 244)
        sbox.line.color.rgb = GREEN_ACCENT
        sbox.line.width = Pt(1)
        tf_sb = sbox.text_frame
        tf_sb.word_wrap = True
        tf_sb.margin_top = Inches(0.04)
        p_sh = tf_sb.paragraphs[0]
        p_sh.text = f"Fix: {strat}"
        p_sh.font.name = "Calibri"
        p_sh.font.size = Pt(9.5)
        p_sh.font.color.rgb = TEXT_DARK

    # Panel 3: Practical Implementation & Viability (Right Column)
    p3_card = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(9.3), Inches(1.72), Inches(3.6), Inches(5.08))
    p3_card.fill.solid()
    p3_card.fill.fore_color.rgb = RGBColor(248, 253, 250)
    p3_card.line.color.rgb = GREEN_ACCENT
    p3_card.line.width = Pt(1.5)

    p3_title = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(9.45), Inches(1.85), Inches(3.3), Inches(0.42))
    p3_title.fill.solid()
    p3_title.fill.fore_color.rgb = GREEN_ACCENT
    p3_title.line.fill.background()
    tf_p3t = p3_title.text_frame
    p_p3t = tf_p3t.paragraphs[0]
    p_p3t.text = "Practical Implementation & Viability"
    p_p3t.font.name = "Calibri"
    p_p3t.font.bold = True
    p_p3t.font.size = Pt(13)
    p_p3t.font.color.rgb = WHITE
    p_p3t.alignment = PP_ALIGN.CENTER

    imp_points = [
        ("01", "Drastic Cost Reduction", "Drops adjudication cost from ₹450 (manual casework) to under ₹2.50 per automated verification."),
        ("02", "Immediate Deployability", "Dockerized container bundle readily deploys on State Data Centers (SDC) or NIC MeghRaj cloud."),
        ("03", "Frictionless Adoption", "Intuitive PWA requires zero officer training; plain-language reason codes with visual bounding boxes."),
        ("04", "Statutory Admissibility", "Cryptographic SHA-256 digital stamp and audit log admissible under Right to Public Services Act."),
        ("05", "Real-Time Telemetry", "Ministerial dashboard offers live tracking of fund disbursement speed, fraud heatmaps, and scheme bottlenecks.")
    ]

    for idx, (num, htxt, btxt) in enumerate(imp_points):
        top_pos = Inches(2.45 + idx * 0.85)
        pill_n = s4.shapes.add_shape(MSO_SHAPE.OVAL, Inches(9.45), top_pos, Inches(0.35), Inches(0.35))
        pill_n.fill.solid()
        pill_n.fill.fore_color.rgb = GREEN_ACCENT
        pill_n.line.fill.background()
        tf_pn = pill_n.text_frame
        p_pn = tf_pn.paragraphs[0]
        p_pn.text = num
        p_pn.font.name = "Calibri"
        p_pn.font.bold = True
        p_pn.font.size = Pt(10)
        p_pn.font.color.rgb = WHITE
        p_pn.alignment = PP_ALIGN.CENTER

        tb_imp = s4.shapes.add_textbox(Inches(9.85), top_pos - Inches(0.04), Inches(2.9), Inches(0.8))
        tf_imp = tb_imp.text_frame
        tf_imp.word_wrap = True
        tf_imp.margin_top = Inches(0)
        p_it = tf_imp.paragraphs[0]
        p_it.text = htxt + ": "
        p_it.font.name = "Calibri"
        p_it.font.bold = True
        p_it.font.size = Pt(10.5)
        p_it.font.color.rgb = GREEN_ACCENT

        p_id = tf_imp.add_paragraph()
        p_id.text = btxt
        p_id.font.name = "Calibri"
        p_id.font.size = Pt(9.5)
        p_id.font.color.rgb = TEXT_DARK

    # =========================================================================
    # SLIDE 5: IMPACT AND BENEFITS
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    set_white_bg(s5)
    add_header(s5, "IMPACT AND BENEFITS")
    add_bottom_bar(s5, "5")

    # Left Column: Potential Impact Flow (matching template's vertical flow)
    lbl_flow = s5.shapes.add_textbox(Inches(0.4), Inches(1.15), Inches(3.2), Inches(0.35))
    lbl_flow.text_frame.paragraphs[0].text = "POTENTIAL IMPACT FLOW"
    lbl_flow.text_frame.paragraphs[0].font.name = "Calibri"
    lbl_flow.text_frame.paragraphs[0].font.bold = True
    lbl_flow.text_frame.paragraphs[0].font.size = Pt(13)
    lbl_flow.text_frame.paragraphs[0].font.color.rgb = DARK_RED

    impact_flow = [
        ("1. CITIZEN UPLOAD", "Applicant or contractor uploads files via mobile scanner or web portal."),
        ("2. AUTOGOV+ INGESTION", "Auto-deskew, layout categorization, and OCR text extraction in < 1.2s."),
        ("3. AI INTEGRITY AUDIT", "PyTorch ELA checks tampering; FAISS checks cross-scheme duplicates."),
        ("4. EXPLAINABLE CLEARANCE", "Clean files auto-approved; high-risk flagged with SHAP evidence."),
        ("5. TRANSPARENT GOVERNANCE", "Instant disbursement, zero leakages, and tamper-proof public audit trail.")
    ]

    for idx, (ftitle, fdesc) in enumerate(impact_flow):
        ftop = Inches(1.52 + idx * 1.05)
        fc = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.4), ftop, Inches(3.2), Inches(0.96))
        fc.fill.solid()
        fc.fill.fore_color.rgb = LIGHT_BG_RED
        fc.line.color.rgb = DARK_RED
        fc.line.width = Pt(1)

        tf_fc = fc.text_frame
        tf_fc.word_wrap = True
        tf_fc.margin_top = Inches(0.04)
        p_fct = tf_fc.paragraphs[0]
        p_fct.text = ftitle
        p_fct.font.name = "Calibri"
        p_fct.font.bold = True
        p_fct.font.size = Pt(10.5)
        p_fct.font.color.rgb = DARK_RED

        p_fcd = tf_fc.add_paragraph()
        p_fcd.text = fdesc
        p_fcd.font.name = "Calibri"
        p_fcd.font.size = Pt(9.5)
        p_fcd.font.color.rgb = TEXT_DARK

    # Center Grid: Benefits by Pillar
    lbl_ben = s5.shapes.add_textbox(Inches(3.8), Inches(1.15), Inches(5.8), Inches(0.35))
    lbl_ben.text_frame.paragraphs[0].text = "BENEFITS BY PILLAR"
    lbl_ben.text_frame.paragraphs[0].font.name = "Calibri"
    lbl_ben.text_frame.paragraphs[0].font.bold = True
    lbl_ben.text_frame.paragraphs[0].font.size = Pt(13)
    lbl_ben.text_frame.paragraphs[0].font.color.rgb = DARK_RED

    benefit_pillars = [
        ("Target Beneficiaries", RGBColor(110, 80, 180), [
            "Citizens applying for welfare schemes & institutional certificates",
            "District Collectors, Nodal Adjudication Officers & Caseworkers",
            "State & Central Ministries (MoSPI, MPLADS, Panchayati Raj)",
            "Honest contractors and independent public auditors"
        ]),
        ("Social Impact", RGBColor(210, 60, 90), [
            "Eradicates bureaucratic delays and citizen harassment in welfare access",
            "Eliminates rent-seeking and arbitrary manual document rejection",
            "Restores public trust with transparent, explainable decision records",
            "Enforces strict Right to Public Services (RTS) statutory delivery times"
        ]),
        ("Economic Impact", RGBColor(200, 130, 20), [
            "Saves crores by eliminating cross-scheme duplicate billing & ghost projects",
            "Lowers administrative processing expenditure from ₹450 to ₹2.50 per case",
            "Accelerates capital deployment for critical rural infrastructure projects",
            "Zero expensive GPU infrastructure required—runs on commodity compute"
        ]),
        ("Operational Impact", RGBColor(30, 120, 180), [
            "10x to 100x clearance acceleration: turnaround slashed from 25 days to 4.8s",
            "100% computational audit coverage: replaces flawed random spot-checks",
            "Caseworkers focus exclusively on the 18% highest-risk flagged files",
            "Seamless interoperability with DigiLocker, DPI registries & state portals"
        ]),
        ("Technological & Governance Impact", RGBColor(30, 150, 100), [
            "Zero-PII layout analysis adhering to DPDP Act 2023 & UIDAI circulars",
            "Court-admissible Explainable AI (SHAP) eliminating 'black box' rejections",
            "Cryptographically sealed SHA-256 audit trail preventing post-facto tampering",
            "Verifiable digital clearance certificate equipped with dynamic QR code"
        ])
    ]

    for p_idx, (p_title, p_color, p_bullets) in enumerate(benefit_pillars):
        card_top = Inches(1.52 + p_idx * 1.05)
        b_card = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(3.8), card_top, Inches(6.0), Inches(0.96))
        b_card.fill.solid()
        b_card.fill.fore_color.rgb = WHITE
        b_card.line.color.rgb = p_color
        b_card.line.width = Pt(1.5)

        # Title pill on left of card
        pill = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(3.9), card_top + Inches(0.08), Inches(1.9), Inches(0.8))
        pill.fill.solid()
        pill.fill.fore_color.rgb = p_color
        pill.line.fill.background()
        tf_p = pill.text_frame
        tf_p.word_wrap = True
        tf_p.margin_top = Inches(0.08)
        p_pt = tf_p.paragraphs[0]
        p_pt.text = p_title
        p_pt.font.name = "Calibri"
        p_pt.font.bold = True
        p_pt.font.size = Pt(11)
        p_pt.font.color.rgb = WHITE
        p_pt.alignment = PP_ALIGN.CENTER

        # Bullet points
        tb_bp = s5.shapes.add_textbox(Inches(5.9), card_top + Inches(0.02), Inches(3.8), Inches(0.9))
        tf_bp = tb_bp.text_frame
        tf_bp.word_wrap = True
        tf_bp.margin_top = Inches(0.02)
        for b_idx, bullet in enumerate(p_bullets[:2]):
            p = tf_bp.paragraphs[0] if b_idx == 0 else tf_bp.add_paragraph()
            p.text = f"• {bullet}"
            p.font.name = "Calibri"
            p.font.size = Pt(9.5)
            p.font.color.rgb = TEXT_DARK

    # Right Column: Big Impact Summary Pill Card (matching template's right callout)
    callout_card = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(10.1), Inches(1.52), Inches(2.9), Inches(5.2))
    callout_card.fill.solid()
    callout_card.fill.fore_color.rgb = LIGHT_BG_RED
    callout_card.line.color.rgb = DARK_RED
    callout_card.line.width = Pt(1.5)

    tf_callout = callout_card.text_frame
    tf_callout.word_wrap = True
    tf_callout.vertical_anchor = MSO_ANCHOR.MIDDLE

    p_c1 = tf_callout.paragraphs[0]
    p_c1.text = "AUTOGOV+ GOVERNANCE VISION"
    p_c1.font.name = "Calibri"
    p_c1.font.bold = True
    p_c1.font.size = Pt(13)
    p_c1.font.color.rgb = DARK_RED
    p_c1.alignment = PP_ALIGN.CENTER

    p_c2 = tf_callout.add_paragraph()
    p_c2.space_before = Pt(16)
    p_c2.text = "\"A high-velocity, tamper-proof, and explainable governance infrastructure ensuring public welfare and MPLADS funds reach every rightful citizen without delay, leakage, or bureaucratic friction.\""
    p_c2.font.name = "Calibri"
    p_c2.font.italic = True
    p_c2.font.size = Pt(13)
    p_c2.font.color.rgb = TEXT_DARK
    p_c2.alignment = PP_ALIGN.CENTER

    p_c3 = tf_callout.add_paragraph()
    p_c3.space_before = Pt(20)
    p_c3.text = "✓ 82% Auto-Clearance Rate\n✓ < 4.8s Turnaround Time\n✓ 94% Cost Reduction\n✓ Zero-PII Compliance"
    p_c3.font.name = "Calibri"
    p_c3.font.bold = True
    p_c3.font.size = Pt(12)
    p_c3.font.color.rgb = DARK_RED
    p_c3.alignment = PP_ALIGN.CENTER

    # =========================================================================
    # SLIDE 6: RESEARCH AND REFERENCES
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    set_white_bg(s6)
    add_header(s6, "RESEARCH  AND REFERENCES")
    add_bottom_bar(s6, "6")

    tb_s6 = s6.shapes.add_textbox(Inches(0.4), Inches(1.15), Inches(12.5), Inches(5.6))
    tf_s6 = tb_s6.text_frame
    tf_s6.word_wrap = True

    ref_sections = [
        ("1. Statutory Standards & e-Governance Policies", [
            ("Digital Personal Data Protection (DPDP) Act 2023: ", "Mandatory data minimization, purpose limitation, and zero-PII architectural standards for citizen document handling."),
            ("Right to Public Services (RTS) Act: ", "Statutory delivery timelines for public scheme sanctioning and digital certificate issuance."),
            ("MeitY Guidelines on e-Governance Applications (e-Gov Standards 2.0): ", "Interoperability specifications, API protocols, and cryptographic audit trail mandates."),
            ("UIDAI Technical Circulars (Aadhaar Data Security Regulations): ", "Strict prohibition on persistent raw biometric and unmasked identifier storage in public databases.")
        ]),
        ("2. Computer Vision, Document Geometry & Forgery Detection", [
            ("Krawetz, N. (2007): ", "A Picture's Worth... Digital Image Analysis & Error Level Analysis (ELA) — Baseline compression quantization principles for identifying spliced signatures and altered text figures."),
            ("Barlas et al. (2021): ", "Document Layout Analysis and Geometric Feature Alignment for Fraud Detection — Spatial bounding-box alignment for institutional seals, stamps, and layout integrity."),
            ("Redmon et al. (YOLO) & OpenCV DNN: ", "High-throughput real-time bounding box extraction and landmark localization across varied government forms."),
            ("ArUco & Dynamic Geometric Calibration: ", "Pixel-to-millimeter reference calibration for precise spatial boundary verification.")
        ]),
        ("3. Semantic Deduplication & Explainable AI", [
            ("Reimers & Gurevych (2019): ", "Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks — Dense semantic representations for detecting duplicate public works billing and contractor collusion."),
            ("Johnson, Douze, & Jégou (Meta AI, 2019): ", "Billion-scale similarity search with FAISS — Sub-millisecond vector indexing across millions of municipal, state, and MPLAD scheme registries."),
            ("Lundberg & Lee (2017): ", "A Unified Approach to Interpreting Model Predictions (SHAP) — Game-theoretic Shapley additive explanations for legally admissible, court-defensible AI adjudication decisions.")
        ])
    ]

    is_first = True
    for sec_title, sec_items in ref_sections:
        p_sec = tf_s6.paragraphs[0] if is_first else tf_s6.add_paragraph()
        is_first = False
        p_sec.space_before = Pt(8)
        p_sec.space_after = Pt(4)
        p_sec.font.name = "Calibri"
        p_sec.font.bold = True
        p_sec.font.size = Pt(15)
        p_sec.font.color.rgb = DARK_RED
        p_sec.text = sec_title

        for cit_label, cit_text in sec_items:
            p_cit = tf_s6.add_paragraph()
            p_cit.space_after = Pt(3)
            p_cit.font.name = "Calibri"

            r_dot = p_cit.add_run()
            r_dot.text = "•  "
            r_dot.font.bold = True
            r_dot.font.size = Pt(11.5)
            r_dot.font.color.rgb = DARK_RED

            r_lbl = p_cit.add_run()
            r_lbl.text = cit_label
            r_lbl.font.bold = True
            r_lbl.font.size = Pt(11.5)
            r_lbl.font.color.rgb = BLACK

            r_txt = p_cit.add_run()
            r_txt.text = cit_text
            r_txt.font.bold = False
            r_txt.font.size = Pt(11.5)
            r_txt.font.color.rgb = TEXT_DARK

    prs.save(output_pptx)
    print(f"Successfully generated {output_pptx}")

if __name__ == "__main__":
    build_presentation()
