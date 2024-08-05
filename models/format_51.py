# -*- coding: utf-8 -*-
import logging

from odoo import models, fields, api, _
from odoo.exceptions import UserError, ValidationError

_logger = logging.getLogger(__name__)


class Format51(models.AbstractModel):
    _inherit = 'format.mixin'
    _name = 'format.51'
    _description = 'Formato 5.1 - Libro Diario'


    @api.model
    def get_report_data(self, start_date, end_date, company_ids, journal_ids):
        print('get_report_data', start_date, end_date, company_ids)
        """
        Retrieve report data based on the specified start date, end date, and company ID.

        Args:
            start_date (str): The start date of the report period.
            end_date (str): The end date of the report period.
            company_id (int): The ID of the company.

        Returns:
            list: A list of dictionaries containing the report data. Each dictionary represents a row in the report.

        """
        if not company_ids or not start_date or not end_date:
            return []
        self.env.cr.execute("""
            select 
                row_number() over () as correlative_number,
                am."date" ,
                aml."name" as ref, 
                case
                    when aj."type" = 'sale' then '14'
                    when aj."type" = 'purchase' then '8'
                    when aj."type" = 'cash' then '1'
                    when aj."type" = 'bank' then '1'
                    when aj."type" = 'general' then ''
                end as cod_book,
                '' as correlative_number_ope,
                am."name" as document_number,
                aa.code as account_code,
                aa."name" as account_name,
                aml.debit,
                aml.credit
            from account_move_line aml 
            join account_account aa on aa.id = aml.account_id
            join account_move am on am.id = aml.move_id
            join account_journal aj on aj.id = am.journal_id 
            where 
                am.state in ('posted')
                and am."date" between %s and %s
                and am.company_id in %s
                and am.journal_id in %s
            order by am."date" , am.id , aml.id """, 
            (start_date, end_date, tuple(company_ids), tuple(journal_ids))
        )
        return self.env.cr.dictfetchall()

    def generate_pdf_report(self, data=None):
        # self.ensure_one()
        report_action = self.env['ir.actions.report'].search([('report_name', '=', 'tgr_account_reports.report_format_51_view')], limit=1)
        return report_action.report_action(self, data=None)