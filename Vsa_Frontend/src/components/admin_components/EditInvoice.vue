<template>
  <div class="min-h-screen bg-white font-mono">

    <!-- Header -->
    <div class="border-b-2 border-black px-4 sm:px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-12">
      <div>
        <h1 class="text-2xl sm:text-3xl font-black tracking-tighter uppercase">Offline Invoices</h1>
        <p class="text-xs text-gray-500 mt-0.5 tracking-widest uppercase">Manage · Edit · Delete</p>
      </div>
      <div class="flex items-center gap-2 text-xs text-gray-400 border border-gray-200 px-3 py-2 self-start sm:self-auto">
        <span class="w-2 h-2 rounded-full bg-black inline-block animate-pulse"></span>
        <span class="uppercase tracking-widest">{{ totalLabel }}</span>
      </div>
    </div>

    <!-- Filters & Search Bar -->
    <div class="border-b border-gray-200 px-4 sm:px-8 py-4 flex flex-col sm:flex-row gap-3">
      <div class="relative flex-1">
        <input
          v-model="searchQuery"
          @input="onSearchInput"
          type="text"
          placeholder="Search by name, mobile, invoice no..."
          class="w-full border border-gray-300 px-4 py-2 text-sm pr-10 focus:outline-none focus:border-black transition-colors"
        />
        <span class="absolute right-3 top-2.5 text-gray-400">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </span>
      </div>

      <select v-model="filterPaymentType" @change="applyFilters" class="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black bg-white">
        <option value="">All Payment Types</option>
        <option value="Cash">Cash</option>
        <option value="Card">Card</option>
        <option value="UPI">UPI</option>
        <option value="Mixed">Mixed</option>
        <option value="Others">Others</option>
      </select>

      <select v-model="sortKey" @change="applyFilters" class="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black bg-white">
        <option value="created_at_desc">Newest First</option>
        <option value="created_at_asc">Oldest First</option>
        <option value="total_amount_desc">Amount ↓</option>
        <option value="total_amount_asc">Amount ↑</option>
        <option value="full_name_asc">Name A→Z</option>
        <option value="full_name_desc">Name Z→A</option>
      </select>

      <button @click="clearFilters" class="border border-gray-300 px-4 py-2 text-sm hover:bg-black hover:text-white transition-colors uppercase tracking-wider">
        Clear
      </button>
    </div>

    <!-- Table -->
    <div class="px-4 sm:px-8 py-6">
      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-24 gap-4">
        <div class="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
        <span class="text-xs uppercase tracking-widest text-gray-400">Fetching invoices...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="fetchError" class="border-2 border-red-500 p-6 text-center">
        <p class="text-red-600 font-bold uppercase tracking-wider text-sm">{{ fetchError }}</p>
        <button @click="fetchInvoices" class="mt-4 border border-red-500 text-red-500 px-4 py-2 text-xs uppercase tracking-wider hover:bg-red-500 hover:text-white transition-colors">Retry</button>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredInvoices.length === 0" class="flex flex-col items-center justify-center py-24 gap-3">
        <div class="w-16 h-16 border-2 border-dashed border-gray-300 flex items-center justify-center">
          <svg class="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>
        <p class="text-xs text-gray-400 uppercase tracking-widest">No invoices found</p>
      </div>

      <!-- Desktop Table -->
      <div v-else class="hidden md:block overflow-x-auto border border-gray-200">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-black text-white">
              <th class="text-left px-4 py-3 text-xs uppercase tracking-widest font-semibold">Invoice #</th>
              <th class="text-left px-4 py-3 text-xs uppercase tracking-widest font-semibold">Customer</th>
              <th class="text-left px-4 py-3 text-xs uppercase tracking-widest font-semibold">Mobile</th>
              <th class="text-right px-4 py-3 text-xs uppercase tracking-widest font-semibold">Total</th>
              <th class="text-right px-4 py-3 text-xs uppercase tracking-widest font-semibold">Paid</th>
              <th class="text-right px-4 py-3 text-xs uppercase tracking-widest font-semibold">Pending</th>
              <th class="text-left px-4 py-3 text-xs uppercase tracking-widest font-semibold">Type</th>
              <th class="text-left px-4 py-3 text-xs uppercase tracking-widest font-semibold">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(invoice, idx) in filteredInvoices"
              :key="invoice.isoId"
              @click="openInvoiceDetail(invoice.isoId)"
              :class="[
                'border-b border-gray-100 cursor-pointer transition-colors duration-100',
                idx % 2 === 0 ? 'bg-white' : 'bg-gray-50',
                'hover:bg-black hover:text-white group'
              ]"
            >
              <td class="px-4 py-3 font-bold tracking-tight">{{ invoice.invoice_number }}</td>
              <td class="px-4 py-3">{{ invoice.full_name }}</td>
              <td class="px-4 py-3 text-gray-500 group-hover:text-gray-300">{{ invoice.mobile }}</td>
              <td class="px-4 py-3 text-right font-semibold">₹{{ formatAmount(invoice.total_amount) }}</td>
              <td class="px-4 py-3 text-right">₹{{ formatAmount(invoice.amount_paid) }}</td>
              <td class="px-4 py-3 text-right">
                <span :class="invoice.pending_amount > 0 ? 'text-red-500 group-hover:text-red-300 font-semibold' : 'text-green-600 group-hover:text-green-300'">
                  ₹{{ formatAmount(invoice.pending_amount) }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span class="border border-current px-2 py-0.5 text-xs uppercase tracking-wider">{{ invoice.payment_type }}</span>
              </td>
              <td class="px-4 py-3 text-xs text-gray-500 group-hover:text-gray-300">{{ formatDate(invoice.created_at) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Card List -->
      <div v-if="filteredInvoices.length > 0" class="md:hidden flex flex-col gap-3">
        <div
          v-for="invoice in filteredInvoices"
          :key="invoice.isoId"
          @click="openInvoiceDetail(invoice.isoId)"
          class="border border-gray-200 p-4 cursor-pointer hover:border-black hover:bg-black hover:text-white transition-all duration-150 group"
        >
          <div class="flex justify-between items-start mb-2">
            <span class="font-black text-sm">{{ invoice.invoice_number }}</span>
            <span class="border border-current px-2 py-0.5 text-xs uppercase tracking-wider">{{ invoice.payment_type }}</span>
          </div>
          <div class="text-base font-semibold">{{ invoice.full_name }}</div>
          <div class="text-xs text-gray-400 group-hover:text-gray-300 mt-0.5">{{ invoice.mobile }}</div>
          <div class="flex justify-between mt-3 pt-3 border-t border-gray-100 group-hover:border-gray-700">
            <div>
              <div class="text-xs text-gray-400 group-hover:text-gray-300 uppercase tracking-wider">Total</div>
              <div class="font-bold text-sm">₹{{ formatAmount(invoice.total_amount) }}</div>
            </div>
            <div>
              <div class="text-xs text-gray-400 group-hover:text-gray-300 uppercase tracking-wider">Paid</div>
              <div class="text-sm">₹{{ formatAmount(invoice.amount_paid) }}</div>
            </div>
            <div class="text-right">
              <div class="text-xs text-gray-400 group-hover:text-gray-300 uppercase tracking-wider">Pending</div>
              <div :class="invoice.pending_amount > 0 ? 'text-red-500 font-bold' : 'text-green-600'" class="text-sm">₹{{ formatAmount(invoice.pending_amount) }}</div>
            </div>
          </div>
          <div class="text-xs text-gray-400 group-hover:text-gray-300 mt-2">{{ formatDate(invoice.created_at) }}</div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="!loading && !fetchError" class="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-xs text-gray-400 uppercase tracking-widest">Page {{ currentPage }}</p>
        <div class="flex items-center gap-2">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="border border-gray-300 px-4 py-2 text-xs uppercase tracking-wider transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black hover:text-white hover:border-black"
          >
            ← Prev
          </button>
          <span class="border border-black px-4 py-2 text-xs font-bold bg-black text-white">{{ currentPage }}</span>
          <button
            @click="nextPage"
            :disabled="!hasMore"
            class="border border-gray-300 px-4 py-2 text-xs uppercase tracking-wider transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black hover:text-white hover:border-black"
          >
            Next →
          </button>
        </div>
      </div>
    </div>

    <!-- ===================== INVOICE DETAIL / EDIT MODAL ===================== -->
    <Transition name="modal-fade">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm overflow-y-auto py-6 px-4 mt-12">
        <div class="bg-white w-full max-w-3xl border-2 border-black shadow-[8px_8px_0px_0px_#000] my-auto">

          <!-- Modal Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b-2 border-black bg-black text-white">
            <div>
              <h2 class="text-lg font-black uppercase tracking-tight">
                {{ modalMode === 'view' ? 'Invoice Details' : 'Edit Invoice' }}
              </h2>
              <p class="text-xs text-gray-400 mt-0.5" v-if="activeInvoice">{{ activeInvoice.invoice_number }}</p>
            </div>
            <button @click="closeModal" class="border border-white/40 p-1.5 hover:bg-white hover:text-black transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Modal Loading -->
          <div v-if="modalLoading" class="flex flex-col items-center justify-center py-24 gap-3">
            <div class="w-7 h-7 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            <span class="text-xs uppercase tracking-widest text-gray-400">Loading invoice...</span>
          </div>

          <!-- Modal Error -->
          <div v-else-if="modalError" class="p-8 text-center">
            <p class="text-red-600 font-bold text-sm uppercase tracking-wider">{{ modalError }}</p>
            <button @click="closeModal" class="mt-4 border border-black px-4 py-2 text-xs uppercase tracking-wider hover:bg-black hover:text-white transition-colors">Close</button>
          </div>

          <!-- Modal Content -->
          <div v-else-if="activeInvoice" class="px-6 py-5">

            <!-- Customer Info -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div class="border border-gray-200 p-3">
                <label class="text-xs text-gray-400 uppercase tracking-widest block mb-1">Full Name</label>
                <p class="font-semibold text-sm">{{ activeInvoice.full_name }}</p>
              </div>
              <div class="border border-gray-200 p-3">
                <label class="text-xs text-gray-400 uppercase tracking-widest block mb-1">Mobile</label>
                <p class="font-semibold text-sm">{{ activeInvoice.mobile }}</p>
              </div>
              <div class="border border-gray-200 p-3">
                <label class="text-xs text-gray-400 uppercase tracking-widest block mb-1">WhatsApp</label>
                <p class="font-semibold text-sm">{{ activeInvoice.whatsapp_number || '—' }}</p>
              </div>
              <div class="border border-gray-200 p-3">
                <label class="text-xs text-gray-400 uppercase tracking-widest block mb-1">Email</label>
                <p class="font-semibold text-sm truncate">{{ activeInvoice.email || '—' }}</p>
              </div>
            </div>

            <!-- Items Table -->
            <div class="mb-6">
              <h3 class="text-xs uppercase tracking-widest font-bold mb-3 border-b border-gray-200 pb-2">Items</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm border border-gray-200">
                  <thead>
                    <tr class="bg-gray-100 border-b border-gray-200">
                      <th class="text-left px-3 py-2 text-xs uppercase tracking-wider text-gray-500">#</th>
                      <th class="text-left px-3 py-2 text-xs uppercase tracking-wider text-gray-500">Type</th>
                      <th class="text-left px-3 py-2 text-xs uppercase tracking-wider text-gray-500">Variation ID</th>
                      <th class="text-right px-3 py-2 text-xs uppercase tracking-wider text-gray-500">Qty</th>
                      <th class="text-right px-3 py-2 text-xs uppercase tracking-wider text-gray-500">Price</th>
                      <th class="text-right px-3 py-2 text-xs uppercase tracking-wider text-gray-500">Subtotal</th>
                      <th v-if="modalMode === 'edit'" class="px-3 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, idx) in editableItems" :key="item.isoiId" class="border-b border-gray-100">
                      <td class="px-3 py-2 text-gray-400 text-xs">{{ idx + 1 }}</td>
                      <td class="px-3 py-2">
                        <span class="border border-gray-300 px-2 py-0.5 text-xs uppercase tracking-wider">{{ item.item_type }}</span>
                      </td>
                      <td class="px-3 py-2 text-xs text-gray-500 font-mono">{{ item.item_variation_id }}</td>
                      <td class="px-3 py-2 text-right">
                        <input
                          v-if="modalMode === 'edit'"
                          v-model.number="item.quantity"
                          @input="recalcTotals"
                          type="number"
                          min="1"
                          class="w-16 border border-gray-300 text-right px-2 py-1 text-sm focus:outline-none focus:border-black"
                        />
                        <span v-else>{{ item.quantity }}</span>
                      </td>
                      <td class="px-3 py-2 text-right">
                        <input
                          v-if="modalMode === 'edit'"
                          v-model.number="item.price_at_sale"
                          @input="recalcTotals"
                          type="number"
                          min="0"
                          step="0.01"
                          class="w-24 border border-gray-300 text-right px-2 py-1 text-sm focus:outline-none focus:border-black"
                        />
                        <span v-else>₹{{ formatAmount(item.price_at_sale) }}</span>
                      </td>
                      <td class="px-3 py-2 text-right font-semibold">₹{{ formatAmount(item.quantity * item.price_at_sale) }}</td>
                      <td v-if="modalMode === 'edit'" class="px-3 py-2 text-center">
                        <button
                          @click="removeItem(idx)"
                          :disabled="editableItems.length === 1"
                          :title="editableItems.length === 1 ? 'Invoice must have at least one item' : 'Remove item'"
                          class="border border-red-300 text-red-400 p-1 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
                        >
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Payment Section -->
            <div class="border-t-2 border-black pt-5">
              <h3 class="text-xs uppercase tracking-widest font-bold mb-4">Payment Summary</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>
                  <label class="text-xs text-gray-400 uppercase tracking-widest block mb-1">Total Amount</label>
                  <div class="border border-gray-200 px-3 py-2 font-bold text-lg bg-gray-50">₹{{ formatAmount(calculatedTotal) }}</div>
                </div>

                <div>
                  <label class="text-xs text-gray-400 uppercase tracking-widest block mb-1">Discount Applied</label>
                  <div v-if="modalMode === 'edit'" class="relative">
                    <span class="absolute left-3 top-2.5 text-sm text-gray-400">₹</span>
                    <input
                      v-model.number="editPaymentData.discount_applied"
                      @input="recalcTotals"
                      type="number"
                      min="0"
                      class="w-full border border-gray-300 pl-7 pr-3 py-2 text-sm focus:outline-none focus:border-black"
                    />
                  </div>
                  <div v-else class="border border-gray-200 px-3 py-2 text-sm">₹{{ formatAmount(editPaymentData.discount_applied) }}</div>
                </div>

                <div>
                  <label class="text-xs text-gray-400 uppercase tracking-widest block mb-1">Amount Paid</label>
                  <div v-if="modalMode === 'edit'" class="relative">
                    <span class="absolute left-3 top-2.5 text-sm text-gray-400">₹</span>
                    <input
                      v-model.number="editPaymentData.amount_paid"
                      @input="recalcTotals"
                      type="number"
                      min="0"
                      class="w-full border border-gray-300 pl-7 pr-3 py-2 text-sm focus:outline-none focus:border-black"
                    />
                  </div>
                  <div v-else class="border border-gray-200 px-3 py-2 text-sm">₹{{ formatAmount(editPaymentData.amount_paid) }}</div>
                </div>

                <div>
                  <label class="text-xs text-gray-400 uppercase tracking-widest block mb-1">Pending Amount</label>
                  <div :class="['border px-3 py-2 text-sm font-bold', calculatedPending > 0 ? 'border-red-300 text-red-600 bg-red-50' : 'border-green-300 text-green-600 bg-green-50']">
                    ₹{{ formatAmount(calculatedPending) }}
                  </div>
                </div>
              </div>

              <!-- Validation Error -->
              <div v-if="editValidationError" class="mt-3 border border-red-400 bg-red-50 px-4 py-2 text-xs text-red-600 uppercase tracking-wider">
                {{ editValidationError }}
              </div>
            </div>

            <!-- Modal Action Buttons -->
            <div class="mt-6 pt-5 border-t border-gray-200 flex flex-wrap gap-3 justify-between">
              <!-- Left: Delete + Send Mail -->
              <div class="flex flex-wrap gap-2">
                <button
                  @click="initiateDelete(activeInvoice.isoId)"
                  :disabled="actionLoading"
                  class="border-2 border-red-500 text-red-500 px-4 py-2 text-xs uppercase tracking-wider hover:bg-red-500 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                  Delete Invoice
                </button>

                <button
                  @click="sendMailToCustomer(activeInvoice)"
                  :disabled="actionLoading"
                  class="border-2 border-gray-400 text-gray-600 px-4 py-2 text-xs uppercase tracking-wider hover:bg-gray-800 hover:text-white hover:border-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  Send Mail
                </button>
              </div>

              <!-- Right: Edit toggle + Save -->
              <div class="flex flex-wrap gap-2">
                <button
                  v-if="modalMode === 'view'"
                  @click="switchToEdit"
                  class="border-2 border-black px-5 py-2 text-xs uppercase tracking-wider hover:bg-black hover:text-white transition-colors flex items-center gap-2"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                  Edit
                </button>

                <template v-else>
                  <button
                    @click="cancelEdit"
                    class="border border-gray-300 px-4 py-2 text-xs uppercase tracking-wider hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    @click="saveInvoice"
                    :disabled="actionLoading || !!editValidationError"
                    class="bg-black text-white border-2 border-black px-5 py-2 text-xs uppercase tracking-wider hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <svg v-if="actionLoading" class="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                    {{ actionLoading ? 'Saving...' : 'Save Changes' }}
                  </button>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ===================== CONFIRM DELETE MODAL ===================== -->
    <Transition name="modal-fade">
      <div v-if="showDeleteConfirm" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
        <div class="bg-white border-2 border-black shadow-[6px_6px_0px_0px_#ef4444] w-full max-w-md p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 border-2 border-red-500 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <div>
              <h3 class="font-black uppercase tracking-tight text-base">Confirm Deletion</h3>
              <p class="text-xs text-gray-400 uppercase tracking-wider mt-0.5">This action cannot be undone</p>
            </div>
          </div>
          <p class="text-sm text-gray-600 mb-6 border-l-2 border-red-400 pl-3">
            Deleting this invoice will permanently restore all item stock quantities and mark the invoice as deleted. Are you sure you want to proceed?
          </p>
          <div class="flex gap-3 justify-end">
            <button @click="showDeleteConfirm = false" class="border border-gray-300 px-5 py-2 text-xs uppercase tracking-wider hover:bg-gray-100 transition-colors">
              Cancel
            </button>
            <button
              @click="confirmDelete"
              :disabled="actionLoading"
              class="bg-red-500 text-white border-2 border-red-500 px-5 py-2 text-xs uppercase tracking-wider hover:bg-red-600 hover:border-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <svg v-if="actionLoading" class="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              {{ actionLoading ? 'Deleting...' : 'Yes, Delete' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ===================== TOAST NOTIFICATION ===================== -->
    <Transition name="toast-slide">
      <div
        v-if="toast.show"
        :class="[
          'fixed bottom-6 right-6 z-[70] border-2 px-5 py-3 shadow-lg flex items-center gap-3 text-sm font-semibold uppercase tracking-wider max-w-xs',
          toast.type === 'success' ? 'bg-black text-white border-black' : 'bg-red-500 text-white border-red-600'
        ]"
      >
        <svg v-if="toast.type === 'success'" class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
        </svg>
        <svg v-else class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
        </svg>
        {{ toast.message }}
      </div>
    </Transition>

  </div>
</template>

<script>
export default {
  name: 'EditInvoice',

  data() {
    return {
      // Table data
      invoices: [],
      loading: false,
      fetchError: null,
      currentPage: 1,
      hasMore: false,

      // Filters
      searchQuery: '',
      filterPaymentType: '',
      sortKey: 'created_at_desc',
      searchTimeout: null,

      // Modal state
      showModal: false,
      modalLoading: false,
      modalError: null,
      modalMode: 'view', // 'view' | 'edit'
      activeInvoice: null,

      // Editable copies
      editableItems: [],
      editPaymentData: {
        discount_applied: 0,
        amount_paid: 0,
      },
      calculatedTotal: 0,
      calculatedPending: 0,

      // Edit validation
      editValidationError: '',

      // Delete confirm
      showDeleteConfirm: false,
      pendingDeleteId: null,

      // Action loading (save/delete)
      actionLoading: false,

      // Toast
      toast: {
        show: false,
        message: '',
        type: 'success',
      },
      toastTimer: null,

      // Base API URL — adjust to your environment
      baseUrl: 'http://localhost:3000',
    };
  },

  computed: {
    filteredInvoices() {
      let result = [...this.invoices];

      // Client-side search filter
      if (this.searchQuery.trim()) {
        const q = this.searchQuery.toLowerCase();
        result = result.filter(inv =>
          (inv.full_name || '').toLowerCase().includes(q) ||
          (inv.mobile || '').includes(q) ||
          (inv.invoice_number || '').toLowerCase().includes(q) ||
          (inv.email || '').toLowerCase().includes(q)
        );
      }

      // Payment type filter
      if (this.filterPaymentType) {
        result = result.filter(inv => inv.payment_type === this.filterPaymentType);
      }

      // Sorting
      const [key, dir] = this.sortKey.split('_').reduce((acc, part, i, arr) => {
        if (i === arr.length - 1) return [arr.slice(0, -1).join('_'), part];
        return acc;
      }, ['', '']);

      result.sort((a, b) => {
        let aVal = a[key] ?? '';
        let bVal = b[key] ?? '';
        if (key === 'total_amount' || key === 'amount_paid') {
          aVal = parseFloat(aVal) || 0;
          bVal = parseFloat(bVal) || 0;
        } else if (key === 'created_at') {
          aVal = new Date(aVal).getTime();
          bVal = new Date(bVal).getTime();
        } else {
          aVal = String(aVal).toLowerCase();
          bVal = String(bVal).toLowerCase();
        }
        if (aVal < bVal) return dir === 'asc' ? -1 : 1;
        if (aVal > bVal) return dir === 'asc' ? 1 : -1;
        return 0;
      });

      return result;
    },

    totalLabel() {
      const count = this.filteredInvoices.length;
      return `${count} invoice${count !== 1 ? 's' : ''}`;
    },
  },

  mounted() {
    this.fetchInvoices();
  },

  methods: {
    // ─── Fetch Invoices (Endpoint 1) ───────────────────────────────────────────
    async fetchInvoices() {
      this.loading = true;
      this.fetchError = null;
      try {
        const res = await fetch(
          `${this.baseUrl}/vsa/admin/get-offline-sold-item?page=${this.currentPage}`,
          { headers: this.authHeaders() }
        );
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || 'Failed to fetch invoices');
        this.invoices = data.invoices || [];
        this.hasMore = data.pagination?.hasMore || false;
      } catch (err) {
        this.fetchError = err.message;
      } finally {
        this.loading = false;
      }
    },

    // ─── Pagination ────────────────────────────────────────────────────────────
    nextPage() {
      if (!this.hasMore) return;
      this.currentPage++;
      this.fetchInvoices();
    },

    prevPage() {
      if (this.currentPage <= 1) return;
      this.currentPage--;
      this.fetchInvoices();
    },

    // ─── Filter helpers ────────────────────────────────────────────────────────
    onSearchInput() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        // Search is client-side on current page data; reset page on new search if needed
      }, 300);
    },

    applyFilters() {
      // Sorting & payment type filter are computed — nothing else needed
    },

    clearFilters() {
      this.searchQuery = '';
      this.filterPaymentType = '';
      this.sortKey = 'created_at_desc';
    },

    // ─── Open Invoice Detail (Endpoint 3) ─────────────────────────────────────
    async openInvoiceDetail(isoId) {
      this.showModal = true;
      this.modalLoading = true;
      this.modalError = null;
      this.activeInvoice = null;
      this.modalMode = 'view';
      this.editValidationError = '';

      try {
        const res = await fetch(
          `${this.baseUrl}/vsa/admin/get-all-items-by-invoice/${isoId}`,
          { headers: this.authHeaders() }
        );
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || 'Failed to fetch invoice details');

        this.activeInvoice = data.invoice;
        this.initEditableData(data.invoice);
      } catch (err) {
        this.modalError = err.message;
      } finally {
        this.modalLoading = false;
      }
    },

    // ─── Initialise editable copies ──────────────────────────────────────────
    initEditableData(invoice) {
      // API returns items with `id` as the item row PK (isoiId).
      // We normalise to `isoiId` here so the save payload is always correct.
      this.editableItems = (invoice.items || []).map(item => ({
        ...item,
        isoiId: item.isoiId ?? item.id,   // prefer isoiId if already present, else use id
      }));
      this.editPaymentData = {
        discount_applied: parseFloat(invoice.discount_applied) || 0,
        amount_paid: parseFloat(invoice.amount_paid) || 0,
      };
      this.recalcTotals();
    },

    // ─── Recalculate derived totals ───────────────────────────────────────────
    recalcTotals() {
      const total = this.editableItems.reduce(
        (sum, item) => sum + (parseFloat(item.price_at_sale) || 0) * (parseInt(item.quantity) || 0),
        0
      );
      this.calculatedTotal = total;

      const payable = total - (this.editPaymentData.discount_applied || 0);
      this.calculatedPending = payable - (this.editPaymentData.amount_paid || 0);

      // Live validation
      if (this.editPaymentData.discount_applied > total) {
        this.editValidationError = 'Discount cannot exceed total amount';
      } else if (this.editPaymentData.amount_paid > payable) {
        this.editValidationError = 'Amount paid cannot exceed payable amount';
      } else if (this.editPaymentData.amount_paid < 0 || this.editPaymentData.discount_applied < 0) {
        this.editValidationError = 'Payment values cannot be negative';
      } else {
        this.editValidationError = '';
      }
    },

    switchToEdit() {
      this.modalMode = 'edit';
    },

    cancelEdit() {
      this.modalMode = 'view';
      this.initEditableData(this.activeInvoice);
      this.editValidationError = '';
    },

    removeItem(idx) {
      if (this.editableItems.length <= 1) return; // backend also enforces this
      this.editableItems.splice(idx, 1);
      this.recalcTotals();
    },

    // ─── Save Invoice (Endpoint 4) ────────────────────────────────────────────
    async saveInvoice() {
      if (this.editValidationError) return;

      this.actionLoading = true;
      try {
        const payload = {
          editedItemData: {
            isoId: this.activeInvoice.isoId,
            discount_applied: this.editPaymentData.discount_applied,
            amount_paid: this.editPaymentData.amount_paid,
            items: this.editableItems.map(item => ({
              isoiId: item.isoiId,
              item_id: item.item_id,
              item_type: item.item_type,
              item_variation_id: item.item_variation_id,
              quantity: item.quantity,
              price_at_sale: item.price_at_sale,
            })),
          },
        };

        const res = await fetch(`${this.baseUrl}/vsa/admin/edit-invoice`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...this.authHeaders() },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || 'Failed to update invoice');

        this.showToast('Invoice updated successfully', 'success');
        this.closeModal();
        this.fetchInvoices();
      } catch (err) {
        this.showToast(err.message, 'error');
      } finally {
        this.actionLoading = false;
      }
    },

    closeModal() {
      this.showModal = false;
      this.activeInvoice = null;
      this.modalMode = 'view';
      this.editValidationError = '';
      this.modalError = null;
    },

    // ─── Delete Invoice (Endpoint 2) ──────────────────────────────────────────
    initiateDelete(isoId) {
      this.pendingDeleteId = isoId;
      this.showDeleteConfirm = true;
    },

    async confirmDelete() {
      if (!this.pendingDeleteId) return;
      this.actionLoading = true;
      try {
        const res = await fetch(
          `${this.baseUrl}/vsa/admin/delete-existing-invoice/${this.pendingDeleteId}`,
          { method: 'DELETE', headers: this.authHeaders() }
        );
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || 'Failed to delete invoice');

        this.showToast('Invoice deleted and stock restored', 'success');
        this.showDeleteConfirm = false;
        this.pendingDeleteId = null;
        this.closeModal();
        this.fetchInvoices();
      } catch (err) {
        this.showToast(err.message, 'error');
      } finally {
        this.actionLoading = false;
      }
    },

    // ─── Send Mail (Endpoint stub — server to be written) ─────────────────────
    async sendMailToCustomer(invoice) {
      // TODO: replace with your actual mail endpoint
      this.showToast(`Mail endpoint not yet connected for ${invoice.full_name}`, 'error');
      // Example future implementation:
      // const res = await fetch(`${this.baseUrl}/vsa/admin/send-invoice-mail/${invoice.isoId}`, {
      //   method: 'POST',
      //   headers: this.authHeaders(),
      // });
    },

    // ─── Utility Helpers ──────────────────────────────────────────────────────
    authHeaders() {
      const token = localStorage.getItem('token') || '';
      return { Authorization: `Bearer ${token}` };
    },

    formatAmount(val) {
      const num = parseFloat(val) || 0;
      return num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },

    formatDate(dateStr) {
      if (!dateStr) return '—';
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
      });
    },

    showToast(message, type = 'success') {
      clearTimeout(this.toastTimer);
      this.toast = { show: true, message, type };
      this.toastTimer = setTimeout(() => { this.toast.show = false; }, 3500);
    },
  },
};
</script>

<style scoped>
/* Modal fade transition */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Toast slide transition */
.toast-slide-enter-active {
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.toast-slide-leave-active {
  transition: all 0.2s ease-in;
}
.toast-slide-enter-from {
  opacity: 0;
  transform: translateX(60px);
}
.toast-slide-leave-to {
  opacity: 0;
  transform: translateX(60px);
}

/* Number input — hide spinners */
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type='number'] {
  -moz-appearance: textfield;
}
</style>