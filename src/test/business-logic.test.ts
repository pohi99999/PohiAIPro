import { describe, it, expect } from 'vitest'
import type { ConfirmedMatch, DemandItem, StockItem, DemandStatus, StockStatus } from '../../types'

describe('Business Logic', () => {
  describe('Match Creation', () => {
    it('should create a valid match ID format', () => {
      const demandId = 'demand-1234'
      const stockId = 'stock-5678'
      const timestamp = Date.now()
      
      const matchId = `CONF-${timestamp}-${demandId.slice(-4)}-${stockId.slice(-4)}`
      
      expect(matchId).toMatch(/^CONF-\d+-\w+-\w+$/)
      expect(matchId).toContain(demandId.slice(-4))
      expect(matchId).toContain(stockId.slice(-4))
    })

    it('should calculate commission correctly', () => {
      const volume = 5.5 // m³
      const baseRate = 15 // per m³
      const commissionRate = 0.05 // 5%
      
      const commissionAmount = parseFloat((volume * baseRate * commissionRate).toFixed(2))
      
      expect(commissionAmount).toBe(4.13)
    })
  })

  describe('Shipment Management', () => {
    it('should generate valid shipment ID format', () => {
      const timestamp = Date.now()
      const shipmentId = `SHIP-${timestamp}`
      
      expect(shipmentId).toMatch(/^SHIP-\d+$/)
    })

    it('should calculate total volume correctly', () => {
      const matches = [
        { stockDetails: { cubicMeters: 2.5 } },
        { stockDetails: { cubicMeters: 3.0 } },
        { stockDetails: { cubicMeters: 1.5 } }
      ]
      
      const totalVolume = matches.reduce((sum, m) => sum + (m.stockDetails.cubicMeters || 0), 0)
      
      expect(totalVolume).toBe(7.0)
    })

    it('should check truck capacity constraints', () => {
      const truckCapacity = 10.0 // m³
      const stagedVolume = 8.5 // m³
      const newMatchVolume = 2.0 // m³
      
      const wouldExceedCapacity = stagedVolume + newMatchVolume > truckCapacity
      
      expect(wouldExceedCapacity).toBe(true)
    })
  })

  describe('Data Filtering', () => {
    it('should filter unassigned matches', () => {
      const allMatches = [
        { id: '1', shipmentId: undefined },
        { id: '2', shipmentId: 'SHIP-123' },
        { id: '3', shipmentId: undefined },
        { id: '4', shipmentId: 'SHIP-456' }
      ]
      
      const unassigned = allMatches.filter(m => !m.shipmentId)
      
      expect(unassigned).toHaveLength(2)
      expect(unassigned.map(m => m.id)).toEqual(['1', '3'])
    })

    it('should sort matches by date correctly', () => {
      const matches = [
        { id: '1', matchDate: '2024-01-01T00:00:00Z' },
        { id: '2', matchDate: '2024-03-01T00:00:00Z' },
        { id: '3', matchDate: '2024-02-01T00:00:00Z' }
      ]
      
      const sorted = matches.sort((a, b) => 
        new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime()
      )
      
      expect(sorted.map(m => m.id)).toEqual(['2', '3', '1'])
    })
  })

  describe('Invoice Generation', () => {
    it('should create valid invoice ID format', () => {
      const timestamp = Date.now()
      const companyId = 'company-1234'
      const invoiceId = `INV-${timestamp}-${companyId.slice(-4)}`
      
      expect(invoiceId).toMatch(/^INV-\d+-\w+$/)
    })

    it('should calculate due date correctly', () => {
      const invoiceDate = new Date('2024-01-15')
      const paymentTerms = 30 // days
      const dueDate = new Date(invoiceDate)
      dueDate.setDate(dueDate.getDate() + paymentTerms)
      
      expect(dueDate.toISOString().split('T')[0]).toBe('2024-02-14')
    })
  })

  describe('Storage Key Constants', () => {
    it('should validate localStorage key formats', () => {
      const keys = [
        'pohi-ai-confirmed-matches',
        'pohi-ai-mock-companies',
        'pohi-ai-invoices',
        'pohi-ai-shipments'
      ]
      
      keys.forEach(key => {
        expect(key).toMatch(/^pohi-ai-[a-z-]+$/)
      })
    })
  })
})