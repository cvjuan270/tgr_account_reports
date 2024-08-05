from odoo import http
from odoo.http import request
from odoo.addons.web.controllers.main import content_disposition

class Main(http.Controller):

    def _get_format_51_data(self, kwargs):
        result = []
        format_51 = http.request.env['format.51']
        result = format_51.get_report_data(kwargs.get('startDate'), kwargs.get('endDate'), kwargs.get('companyIds'), kwargs.get('journalIds'))
        return result

    @http.route('/tgr_account_reports/format_51', type='json', auth='user')
    def get_format_51_data(self, **kwargs):
        result = self._get_format_51_data(kwargs)
        return result

    @http.route('/tgr_account_reports/print_pdf', type='http', auth='user')
    def print_pdf(self, startDate=None, endDate=None, companyIds=None, journalIds=None, **kwargs):
        kwargs.update({
            'startDate': startDate,
            'endDate': endDate,
            'companyIds': companyIds.split(',') if companyIds else [],
            'journalIds': journalIds.split(',') if journalIds else []
        })
        data = self._get_format_51_data(kwargs)
        pdf, _ = request.env['ir.actions.report'].with_context(
            start_date=startDate, end_date=endDate, company_ids=companyIds, journal_ids=journalIds
            )._render_qweb_pdf('tgr_account_reports.action_report_format_51', data={'move_lines': data})
        
        pdfhttpheaders = [
            ('Content-Type','applycation/pdf'),
            ('Content-Length',len(pdf))
        ]
        pdfhttpheaders = [('Content-Type', 'application/pdf'), ('Content-Length', len(pdf))]
        return request.make_response(pdf, headers=pdfhttpheaders)