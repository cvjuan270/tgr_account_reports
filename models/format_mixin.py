# -*- coding: utf-8 -*-
import logging

from odoo import models, fields, api, _
from odoo.exceptions import UserError, ValidationError

_logger = logging.getLogger(__name__)


class FormatMixin(models.AbstractModel):
    _name = 'format.mixin'
    _description = 'FormatMixin'

    name = fields.Char('Name')
    start_date = fields.Date('Fecha Inicial')
    end_date = fields.Date('Fecha Final')
    company_id = fields.Many2one('res.company')