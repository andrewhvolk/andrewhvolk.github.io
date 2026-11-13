"""Shared print layout for Math 130 practice packets."""
from pathlib import Path
from reportlab.graphics.shapes import Drawing, Line, String
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle, PageBreak

INK=colors.HexColor('#173b55')
MUTED=colors.HexColor('#475569')

class Packet:
    def __init__(self, output, footer):
        fonts=next((p for p in [Path('C:/Windows/Fonts'),Path('/usr/share/fonts/truetype/dejavu')] if p.exists()))
        for name, choices in [('Packet',['arial.ttf','DejaVuSans.ttf']),('Packet-Bold',['arialbd.ttf','DejaVuSans-Bold.ttf'])]:
            font=next(fonts/c for c in choices if (fonts/c).exists())
            pdfmetrics.registerFont(TTFont(name,str(font)))
        pdfmetrics.registerFontFamily('Packet',normal='Packet',bold='Packet-Bold')
        self.styles={
            'title':ParagraphStyle('title',fontName='Packet-Bold',fontSize=20,leading=25,textColor=INK,spaceAfter=9),
            'body':ParagraphStyle('body',fontName='Packet',fontSize=11,leading=16,spaceAfter=8),
            'small':ParagraphStyle('small',fontName='Packet',fontSize=9,leading=13,textColor=MUTED,spaceAfter=8),
            'question':ParagraphStyle('question',fontName='Packet-Bold',fontSize=11,leading=16,spaceBefore=8,spaceAfter=8),
        }
        self.output,self.footer,self.story=output,footer,[]
    def para(self,text,style='body'):
        return Paragraph(text,self.styles[style])
    def p(self,text,style='body'):
        self.story.append(self.para(text,style))
    def title(self,title,subtitle):
        self.p('MATH 130 · Practice','small');self.p(title,'title');self.p(subtitle)
    def question(self,n,text,space=0):
        self.p(f'{n}. {text}','question')
        if space:self.story.append(Spacer(1,space))
    def page(self):self.story.append(PageBreak())
    def axes(self,compass=False):
        d=Drawing(160,140)
        for x in range(20,141,20):d.add(Line(x,12,x,128,strokeColor=colors.HexColor('#e2e8f0'),strokeWidth=.35))
        for y in range(10,131,20):d.add(Line(12,y,148,y,strokeColor=colors.HexColor('#e2e8f0'),strokeWidth=.35))
        for coords in [(12,70,148,70),(80,12,80,128)]:d.add(Line(*coords,strokeColor=MUTED,strokeWidth=.8))
        for x,y,s in ([(83,128,'N'),(145,74,'E'),(83,4,'S'),(3,74,'W')] if compass else [(147,74,'x'),(84,128,'y')]):
            d.add(String(x,y,s,fontName='Packet',fontSize=9,fillColor=MUTED))
        return d
    def sketch_and_fields(self,fields,compass=False):
        table=Table([[self.axes(compass),self.para('<br/><br/>'.join(fields))]],colWidths=[178,338])
        table.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(-1,-1),8)]))
        self.story.append(table)
    def ratio_table(self):
        data=[['sin θ','cos θ','tan θ'],['','',''],['csc θ','sec θ','cot θ'],['','','']]
        table=Table(data,colWidths=[172]*3,rowHeights=[25,49,25,49])
        table.setStyle(TableStyle([('GRID',(0,0),(-1,-1),.5,colors.HexColor('#cbd5e1')),('FONTNAME',(0,0),(-1,-1),'Packet'),('FONTSIZE',(0,0),(-1,-1),11),('TEXTCOLOR',(0,0),(-1,-1),INK),('BACKGROUND',(0,0),(-1,0),colors.HexColor('#eef4f8')),('BACKGROUND',(0,2),(-1,2),colors.HexColor('#eef4f8')),('VALIGN',(0,0),(-1,-1),'MIDDLE')]))
        self.story.append(table)
    def save(self):
        def footer(canvas,doc):
            canvas.setStrokeColor(colors.HexColor('#cbd5e1'));canvas.line(48,40,564,40)
            canvas.setFont('Packet',8);canvas.setFillColor(MUTED)
            canvas.drawString(48,27,self.footer);canvas.drawRightString(564,27,str(doc.page))
        SimpleDocTemplate(str(self.output),pagesize=(612,792),leftMargin=48,rightMargin=48,topMargin=40,bottomMargin=52,title=self.footer,author='Andrew H. Volk').build(self.story,onFirstPage=footer,onLaterPages=footer)
        print(self.output)
