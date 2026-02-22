<template>
  <div class="min-h-screen bg-black text-white p-6 md:p-10 font-sans">

    <!-- Page Header -->
    <div class="flex items-center gap-4 mb-8 mt-8">
      <div class="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/30">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,12 2,6"/>
        </svg>
      </div>
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-white tracking-tight">Send Mail</h1>
        <p class="text-gray-400 text-sm mt-0.5">Compose and dispatch messages to students &amp; members</p>
      </div>
    </div>

    <!-- Two-column grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">

      <!-- LEFT: Recipients -->
      <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col gap-4">

        <!-- Card header -->
        <div class="flex items-center justify-between">
          <h2 class="text-white font-semibold text-lg">Recipients</h2>
          <span
            class="text-sm font-bold px-3 py-1 rounded-full border transition-all"
            :class="selectedEmails.length >= 50
              ? 'bg-red-500/10 text-red-400 border-red-500/30'
              : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'"
          >
            {{ selectedEmails.length }}<span class="text-gray-500 font-normal">/50</span>
          </span>
        </div>

        <!-- Quick select buttons -->
        <div class="flex flex-wrap gap-2">
          <button
            @click="selectAllByType('student')"
            :disabled="loading"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-violet-500/10 text-violet-300 border-violet-500/25 hover:bg-violet-500/20"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            All Students ({{ studentCount }})
          </button>
          <button
            @click="selectAllByType('user')"
            :disabled="loading"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-emerald-500/10 text-emerald-300 border-emerald-500/25 hover:bg-emerald-500/20"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            All Users ({{ userCount }})
          </button>
          <button
            @click="clearAll"
            :disabled="loading || selectedEmails.length === 0"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-red-500/10 text-red-400 border-red-500/25 hover:bg-red-500/20"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            Clear All
          </button>
        </div>

        <!-- Search -->
        <div class="relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search name or email…"
            class="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl pl-9 pr-9 py-2.5 text-sm outline-none focus:border-indigo-500 transition-colors"
          />
          <button v-if="searchQuery" @click="searchQuery = ''" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors text-lg leading-none">×</button>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex flex-col items-center gap-3 py-10 text-gray-400 text-sm">
          <div class="w-6 h-6 border-2 border-gray-700 border-t-indigo-500 rounded-full animate-spin"></div>
          Loading recipients…
        </div>

        <!-- Error -->
        <div v-else-if="fetchError" class="flex flex-col items-center gap-3 py-8 text-red-400 text-sm text-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <p>{{ fetchError }}</p>
          <button @click="fetchRecipients" class="mt-1 px-4 py-1.5 bg-red-500/10 border border-red-500/25 rounded-lg text-xs font-semibold hover:bg-red-500/20 transition-colors">Retry</button>
        </div>

        <!-- Recipient List -->
        <div v-else class="overflow-y-auto max-h-96 -mx-1 px-1 space-y-1 recipient-scroll">
          <p v-if="filteredRecipients.length === 0" class="text-center text-gray-500 text-sm py-10">No recipients match your search.</p>

          <label
            v-for="person in filteredRecipients"
            :key="person.email"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-all"
            :class="[
              isSelected(person.email)
                ? 'bg-indigo-600/10 border-indigo-500/30'
                : !isSelected(person.email) && selectedEmails.length >= 50
                  ? 'opacity-40 cursor-not-allowed border-transparent'
                  : 'border-transparent hover:bg-gray-800'
            ]"
          >
            <input
              type="checkbox"
              class="w-4 h-4 accent-indigo-500 flex-shrink-0 cursor-pointer"
              :checked="isSelected(person.email)"
              :disabled="!isSelected(person.email) && selectedEmails.length >= 50"
              @change="toggleEmail(person.email)"
            />
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              :class="person.type === 'student' ? 'bg-violet-500/20 text-violet-300' : 'bg-emerald-500/15 text-emerald-300'"
            >
              {{ initials(person.full_name) }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-white text-sm font-medium truncate">{{ person.full_name }}</p>
              <p class="text-gray-400 text-xs truncate">{{ person.email }}</p>
            </div>
            <span
              class="text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide flex-shrink-0"
              :class="person.type === 'student' ? 'bg-violet-500/15 text-violet-300' : 'bg-emerald-500/10 text-emerald-300'"
            >{{ person.type }}</span>
          </label>
        </div>

        <!-- Limit warning -->
        <div v-if="selectedEmails.length >= 50" class="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/25 rounded-xl text-amber-300 text-xs leading-snug">
          <svg class="flex-shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          Maximum 50 recipients reached. Deselect some to add others.
        </div>
      </div>

      <!-- RIGHT: Compose -->
      <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col gap-5">

        <div class="flex items-center justify-between">
          <h2 class="text-white font-semibold text-lg">Compose Message</h2>
          <span class="text-gray-500 text-xs">At least one field required</span>
        </div>

        <!-- Subject -->
        <div>
          <label class="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Subject</label>
          <input
            v-model="form.subject"
            type="text"
            placeholder="e.g. Important update from VSA"
            class="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <!-- Header -->
        <div>
          <label class="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Email Banner Heading</label>
          <input
            v-model="form.header"
            type="text"
            placeholder="e.g. Practice Schedule Change"
            class="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 transition-colors"
          />
          <p class="text-gray-600 text-xs mt-1.5">Displayed as the banner title inside the email.</p>
        </div>

        <!-- Body -->
        <div>
          <label class="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Message Body</label>
          <textarea
            v-model="form.body"
            rows="6"
            placeholder="Write your message here…"
            class="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 transition-colors resize-y leading-relaxed"
          ></textarea>
          <p class="text-gray-600 text-xs mt-1.5">Line breaks will be preserved in the email.</p>
        </div>

        <!-- Attachment -->
        <div>
          <label class="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
            Attachment <span class="text-gray-600 normal-case font-normal tracking-normal">— optional MAX (8 MB)</span>
          </label>

          <div
            v-if="!attachment"
            class="border-2 border-dashed rounded-xl flex flex-col items-center gap-3 py-8 px-4 text-center transition-all cursor-default"
            :class="isDragging ? 'border-indigo-500 bg-indigo-500/5 text-indigo-300' : 'border-gray-700 text-gray-500'"
            @dragover.prevent="isDragging = true"
            @dragleave="isDragging = false"
            @drop.prevent="handleDrop"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <p class="text-sm">Drag &amp; drop a file, or</p>
            <label class="px-4 py-2 bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 rounded-lg text-xs font-semibold cursor-pointer hover:bg-indigo-600/30 transition-colors">
              Browse file
              <input type="file" class="hidden" @change="handleFileChange" />
            </label>
          </div>

          <div v-else class="flex items-center gap-3 px-4 py-3 bg-gray-800 border border-indigo-500/30 rounded-xl">
            <svg class="text-indigo-400 flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
            <div class="flex-1 min-w-0">
              <p class="text-white text-sm font-medium truncate">{{ attachment.filename }}</p>
              <p class="text-gray-400 text-xs">{{ attachmentSize }}</p>
            </div>
            <button @click="removeAttachment" class="w-7 h-7 flex items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        <!-- Selected emails preview -->
        <div v-if="selectedEmails.length > 0" class="flex items-center flex-wrap gap-2 p-3 bg-gray-800 border border-gray-700 rounded-xl">
          <span class="text-gray-500 text-xs font-semibold mr-1">Sending to:</span>
          <span v-for="email in selectedEmails.slice(0, 4)" :key="email" class="text-xs px-2.5 py-0.5 bg-indigo-600/15 text-indigo-300 border border-indigo-500/20 rounded-full">{{ email }}</span>
          <span v-if="selectedEmails.length > 4" class="text-xs px-2.5 py-0.5 bg-gray-700 text-gray-400 border border-gray-600 rounded-full">+{{ selectedEmails.length - 4 }} more</span>
        </div>

        <!-- Error -->
        <div v-if="sendError" class="flex items-start gap-2.5 p-3.5 bg-red-500/10 border border-red-500/25 rounded-xl text-red-300 text-sm leading-snug">
          <svg class="flex-shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {{ sendError }}
        </div>

        <!-- Success -->
        <div v-if="sendSuccess" class="flex items-start gap-2.5 p-3.5 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-emerald-300 text-sm leading-snug">
          <svg class="flex-shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
          {{ sendSuccess }}
        </div>

        <!-- Send Button -->
        <button
          @click="sendMail"
          :disabled="sending || selectedEmails.length === 0"
          class="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-bold text-sm transition-all text-white"
          :class="sending || selectedEmails.length === 0
            ? 'bg-indigo-800 opacity-50 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/25'"
        >
          <template v-if="!sending">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            Send to {{ selectedEmails.length }} recipient{{ selectedEmails.length !== 1 ? 's' : '' }}
          </template>
          <template v-else>
            <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Sending…
          </template>
        </button>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SendMail",

  data() {
    return {
      recipients: [],
      selectedEmails: [],
      searchQuery: "",
      loading: false,
      fetchError: null,

      form: {
        subject: "",
        header: "",
        body: "",
      },
      attachment: null,
      isDragging: false,

      sending: false,
      sendError: null,
      sendSuccess: null,
    };
  },

  computed: {
    filteredRecipients() {
      const q = this.searchQuery.toLowerCase().trim();
      if (!q) return this.recipients;
      return this.recipients.filter(
        (p) =>
          p.full_name.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q)
      );
    },
    studentCount() {
      return this.recipients.filter((p) => p.type === "student").length;
    },
    userCount() {
      return this.recipients.filter((p) => p.type === "user").length;
    },
    attachmentSize() {
      if (!this.attachment?._raw) return "";
      const bytes = this.attachment._raw.size;
      if (bytes < 1024) return bytes + " B";
      if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
      return (bytes / 1048576).toFixed(1) + " MB";
    },
  },

  mounted() {
    this.fetchRecipients();
  },

  methods: {
    getToken() {
      return localStorage.getItem("token") || "";
    },

    async fetchRecipients() {
      this.loading = true;
      this.fetchError = null;
      try {
        const res = await fetch("http://localhost:3000/vsa/admin/get-all-for-mail", {
          headers: { Authorization: `Bearer ${this.getToken()}` },
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch recipients.");
        // Deduplicate by email — first occurrence wins (students have priority)
        const seen = new Set();
        this.recipients = data.data.filter((p) => {
          if (seen.has(p.email)) return false;
          seen.add(p.email);
          return true;
        });
      } catch (err) {
        this.fetchError = err.message;
      } finally {
        this.loading = false;
      }
    },

    isSelected(email) {
      return this.selectedEmails.includes(email);
    },

    toggleEmail(email) {
      const idx = this.selectedEmails.indexOf(email);
      if (idx > -1) {
        this.selectedEmails.splice(idx, 1);
      } else {
        if (this.selectedEmails.length >= 50) return;
        this.selectedEmails.push(email);
      }
      this.sendError = null;
      this.sendSuccess = null;
    },

    selectAllByType(type) {
      const typeEmails = this.recipients
        .filter((p) => p.type === type)
        .map((p) => p.email);
      const allSelected = typeEmails.every((e) => this.selectedEmails.includes(e));
      if (allSelected) {
        this.selectedEmails = this.selectedEmails.filter((e) => !typeEmails.includes(e));
        return;
      }
      for (const email of typeEmails) {
        if (this.selectedEmails.length >= 50) break;
        if (!this.selectedEmails.includes(email)) this.selectedEmails.push(email);
      }
      this.sendError = null;
      this.sendSuccess = null;
    },

    clearAll() {
      this.selectedEmails = [];
      this.sendError = null;
      this.sendSuccess = null;
    },

    initials(name) {
      if (!name) return "?";
      const parts = name.trim().split(" ");
      return parts.length >= 2
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : name.slice(0, 2).toUpperCase();
    },

    handleFileChange(e) {
      const file = e.target.files[0];
      if (file) this.processFile(file);
      e.target.value = "";
    },

    handleDrop(e) {
      this.isDragging = false;
      const file = e.dataTransfer.files[0];
      if (file) this.processFile(file);
    },

    processFile(file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const base64 = ev.target.result.split(",")[1];
        this.attachment = {
          filename: file.name,
          content: base64,
          contentType: file.type || "application/octet-stream",
          _raw: file,
        };
      };
      reader.readAsDataURL(file);
    },

    removeAttachment() {
      this.attachment = null;
    },

    hasContent() {
      return (
        this.form.subject.trim() ||
        this.form.header.trim() ||
        this.form.body.trim() ||
        this.attachment
      );
    },

    async sendMail() {
      this.sendError = null;
      this.sendSuccess = null;

      if (this.selectedEmails.length === 0) {
        this.sendError = "Please select at least one recipient.";
        return;
      }
      if (!this.hasContent()) {
        this.sendError = "Please provide at least one of: subject, header, body, or attachment.";
        return;
      }

      this.sending = true;
      try {
        const payload = {
          emails: this.selectedEmails,
          subject: this.form.subject.trim() || undefined,
          header: this.form.header.trim() || undefined,
          body: this.form.body.trim() || undefined,
        };

        if (this.attachment) {
          payload.attachment = {
            filename: this.attachment.filename,
            content: this.attachment.content,
            contentType: this.attachment.contentType,
          };
        }

        const res = await fetch("http://localhost:3000/vsa/admin/send-mail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.getToken()}`,
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || "Failed to send email.");

        this.sendSuccess = data.message;
        this.form = { subject: "", header: "", body: "" };
        this.attachment = null;
        this.clearAll();
      } catch (err) {
        this.sendError = err.message;
      } finally {
        this.sending = false;
      }
    },
  },
};
</script>

<style scoped>
.recipient-scroll {
  scrollbar-width: thin;
  scrollbar-color: #374151 transparent;
}
.recipient-scroll::-webkit-scrollbar {
  width: 4px;
}
.recipient-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.recipient-scroll::-webkit-scrollbar-thumb {
  background-color: #374151;
  border-radius: 4px;
}
</style>