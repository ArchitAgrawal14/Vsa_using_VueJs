<template>
  <div class="min-h-screen bg-slate-950 flex items-start justify-center px-4 py-10 font-body">
    <!-- Ambient background glow -->
    <div class="pointer-events-none fixed inset-0 overflow-hidden">
      <div class="absolute -top-32 -left-32 w-96 h-96 bg-indigo-700/20 rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 -right-24 w-80 h-80 bg-violet-700/15 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl"></div>
    </div>

    <div class="relative w-full max-w-2xl">

      <!-- ── Header -->
      <div class="mb-8 animate-fadein mt-8">
        <div class="flex items-center gap-3 mb-1">
          <span class="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-500/20 border border-indigo-500/30">
            <!-- Paper plane icon -->
            <svg class="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/>
            </svg>
          </span>
          <p class="text-indigo-400 text-xs font-semibold tracking-widest uppercase">Admin Panel</p>
        </div>
        <h1 class="text-3xl sm:text-4xl font-display font-bold text-white leading-tight">
          Send Newsletter
        </h1>
        <p class="mt-2 text-slate-400 text-sm">
          Compose and dispatch a newsletter to all active subscribers. Maximum <span class="text-indigo-400 font-medium">40 recipients</span> per send.
        </p>
      </div>

      <!-- ── Form card ──────────────────────────────────────── -->
      <form
        @submit.prevent="sendNewsletter"
        class="bg-slate-900/70 backdrop-blur border border-slate-800 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden animate-slidein"
      >

        <!-- Progress bar (visible while sending) -->
        <div
          class="h-0.5 bg-indigo-500 transition-all duration-700 ease-out"
          :style="{ width: sending ? '85%' : '0%', opacity: sending ? 1 : 0 }"
        ></div>

        <div class="p-6 sm:p-8 space-y-6">

          <!-- Subject -->
          <div class="field-group">
            <label class="field-label" for="subject">
              Subject
              <span class="text-slate-500 font-normal text-xs ml-1">(recommended)</span>
            </label>
            <input
              id="subject"
              v-model="form.subject"
              type="text"
              placeholder="e.g. Summer Camp Registration Now Open!"
              maxlength="150"
              class="field-input"
              :disabled="sending"
            />
            <p class="field-hint">{{ form.subject.length }}/150</p>
          </div>

          <!-- Header -->
          <div class="field-group">
            <label class="field-label" for="header">
              Email Header
              <span class="text-slate-500 font-normal text-xs ml-1">(banner title)</span>
            </label>
            <input
              id="header"
              v-model="form.header"
              type="text"
              placeholder="e.g. Exciting News from VSA!"
              maxlength="100"
              class="field-input"
              :disabled="sending"
            />
          </div>

          <!-- Body -->
          <div class="field-group">
            <label class="field-label" for="body">Message Body</label>
            <textarea
              id="body"
              v-model="form.body"
              rows="6"
              placeholder="Write your newsletter content here. Basic formatting (bold, italic, links) is supported."
              class="field-input resize-none"
              :disabled="sending"
            ></textarea>
            <p class="field-hint">{{ form.body.length }} characters</p>
          </div>

          <!-- Attachment -->
          <div class="field-group">
            <label class="field-label">
              Attachment
              <span class="text-slate-500 font-normal text-xs ml-1">(max 10 MB)</span>
            </label>

            <!-- Drop zone -->
            <div
              class="relative border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer"
              :class="[
                dragOver
                  ? 'border-indigo-400 bg-indigo-500/10'
                  : 'border-slate-700 hover:border-slate-500 bg-slate-800/40',
                sending ? 'opacity-50 cursor-not-allowed' : ''
              ]"
              @dragover.prevent="dragOver = true"
              @dragleave="dragOver = false"
              @drop.prevent="handleDrop"
              @click="!sending && $refs.fileInput.click()"
            >
              <input
                ref="fileInput"
                type="file"
                class="sr-only"
                accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.txt,.doc,.docx,.xls,.xlsx"
                @change="handleFileChange"
                :disabled="sending"
              />

              <!-- Empty state -->
              <div v-if="!form.attachment" class="py-8 px-4 text-center">
                <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-700/60 mb-3">
                  <svg class="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 002.112 2.13"/>
                  </svg>
                </div>
                <p class="text-slate-300 text-sm font-medium">Drop a file or <span class="text-indigo-400">browse</span></p>
                <p class="text-slate-500 text-xs mt-1">PDF, images, Word, Excel, plain text</p>
              </div>

              <!-- File selected state -->
              <div v-else class="flex items-center gap-4 p-4">
                <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                  <svg class="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-slate-200 text-sm font-medium truncate">{{ form.attachment.filename }}</p>
                  <p class="text-slate-500 text-xs mt-0.5">{{ formatFileSize(form.attachment.sizeBytes) }} · {{ form.attachment.contentType }}</p>
                </div>
                <button
                  type="button"
                  @click.stop="removeAttachment"
                  class="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                  title="Remove attachment"
                  :disabled="sending"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- File error -->
            <p v-if="fileError" class="mt-2 text-red-400 text-xs flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/>
              </svg>
              {{ fileError }}
            </p>
          </div>

          <!-- ── Response banner ─────────────────────────────── -->
          <transition name="banner">
            <div
              v-if="response"
              class="rounded-xl px-4 py-3.5 flex items-start gap-3 text-sm"
              :class="response.success
                ? 'bg-emerald-500/10 border border-emerald-500/25 text-emerald-300'
                : 'bg-red-500/10 border border-red-500/25 text-red-300'"
            >
              <!-- Success icon -->
              <svg v-if="response.success" class="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <!-- Error icon -->
              <svg v-else class="w-5 h-5 flex-shrink-0 mt-0.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/>
              </svg>
              <div>
                <p class="font-medium">{{ response.success ? 'Newsletter sent!' : 'Failed to send' }}</p>
                <p class="mt-0.5 opacity-80">{{ response.message }}</p>
                <p v-if="response.success && response.messageId" class="mt-1 text-xs opacity-50 font-mono">ID: {{ response.messageId }}</p>
              </div>
            </div>
          </transition>

          <!-- ── Submit button ───────────────────────────────── -->
          <button
            type="submit"
            class="w-full relative flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
            :class="sending
              ? 'bg-indigo-600/60 text-indigo-200 cursor-wait'
              : 'bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white shadow-lg shadow-indigo-900/40'"
            :disabled="sending || !!fileError"
          >
            <!-- Spinner -->
            <svg v-if="sending" class="animate-spin w-4 h-4 text-indigo-300" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            <!-- Send icon -->
            <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/>
            </svg>
            {{ sending ? 'Sending newsletter…' : 'Send Newsletter' }}
          </button>

        </div>
      </form>

      <!-- Footer note -->
      <p class="text-center text-slate-600 text-xs mt-6 animate-fadein" style="animation-delay:300ms">
        Emails are sent via BCC — subscriber addresses remain private.
      </p>

    </div>
  </div>
</template>

<script>
const API_BASE = "http://localhost:3000" || "";

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024; // 10 MB

export default {
  name: "SendNewsLetter",

  data() {
    return {
      form: {
        subject: "",
        header: "",
        body: "",
        // attachment: null | { filename, contentType, content (base64), sizeBytes }
        attachment: null,
      },
      dragOver: false,
      fileError: "",
      sending: false,
      // response: null | { success, message, messageId? }
      response: null,
    };
  },

  mounted() {
    // Verify token presence early; warn in console if missing.
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("[SendNewsLetter] No auth token found in localStorage under key 'token'.");
    }
  },

  methods: {
    // ── File handling ──────────────────────────────────────

    handleDrop(event) {
      this.dragOver = false;
      const file = event.dataTransfer.files[0];
      if (file) this.processFile(file);
    },

    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) this.processFile(file);
      // Reset input so the same file can be re-selected after removal
      event.target.value = "";
    },

    processFile(file) {
      this.fileError = "";
      this.response = null;

      // Validate MIME type
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        this.fileError = `File type '${file.type || "unknown"}' is not allowed. Use PDF, images, Word, Excel, or plain text.`;
        return;
      }

      // Validate size
      if (file.size > MAX_ATTACHMENT_BYTES) {
        this.fileError = `File is too large (${this.formatFileSize(file.size)}). Maximum allowed size is 10 MB.`;
        return;
      }

      // Read as base64
      const reader = new FileReader();
      reader.onload = (e) => {
        // e.target.result is "data:<mime>;base64,<data>" — strip the prefix
        const base64Content = e.target.result.split(",")[1];
        this.form.attachment = {
          filename: file.name,
          contentType: file.type,
          content: base64Content,
          sizeBytes: file.size,
        };
      };
      reader.onerror = () => {
        this.fileError = "Could not read the selected file. Please try again.";
      };
      reader.readAsDataURL(file);
    },

    removeAttachment() {
      this.form.attachment = null;
      this.fileError = "";
    },

    // ── Utilities ──────────────────────────────────────────

    formatFileSize(bytes) {
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    },

    buildPayload() {
      const payload = {};
      if (this.form.subject.trim()) payload.subject = this.form.subject.trim();
      if (this.form.header.trim())  payload.header  = this.form.header.trim();
      if (this.form.body.trim())    payload.body    = this.form.body.trim();
      if (this.form.attachment) {
        payload.attachment = {
          filename:    this.form.attachment.filename,
          contentType: this.form.attachment.contentType,
          content:     this.form.attachment.content,
        };
      }
      return payload;
    },

    // ── API call ───────────────────────────────────────────

    async sendNewsletter() {
      this.response = null;

      // Guard: at least one field must be filled
      if (
        !this.form.subject.trim() &&
        !this.form.header.trim() &&
        !this.form.body.trim() &&
        !this.form.attachment
      ) {
        this.response = {
          success: false,
          message: "Please fill in at least one of: subject, header, body, or attach a file.",
        };
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        this.response = {
          success: false,
          message: "Authentication token not found. Please log in again.",
        };
        return;
      }

      this.sending = true;

      try {
        const res = await fetch(`${API_BASE}/vsa/admin/send-news-letter`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(this.buildPayload()),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          this.response = {
            success: true,
            message: data.message,
            messageId: data.messageId,
          };
          // Reset form on success
          this.form = { subject: "", header: "", body: "", attachment: null };
          this.fileError = "";
        } else {
          this.response = {
            success: false,
            message: data.message || `Server returned ${res.status}.`,
          };
        }
      } catch (err) {
        console.error("[SendNewsLetter] Network error:", err);
        this.response = {
          success: false,
          message: "Network error — could not reach the server. Check your connection.",
        };
      } finally {
        this.sending = false;
      }
    },
  },
};
</script>

<style scoped>
/* ── Google Fonts ─────────────────────────────────────────── */
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600&display=swap');

/* ── CSS custom properties ────────────────────────────────── */
:root {
  --font-display: 'DM Serif Display', Georgia, serif;
  --font-body:    'DM Sans', system-ui, sans-serif;
}

.font-display { font-family: var(--font-display); }
.font-body    { font-family: var(--font-body); }

/* ── Field helpers ────────────────────────────────────────── */
.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.field-label {
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: #cbd5e1; /* slate-300 */
}

.field-input {
  width: 100%;
  background-color: rgb(15 23 42 / 0.6);   /* slate-950/60 */
  border: 1px solid rgb(51 65 85 / 0.8);   /* slate-700/80 */
  border-radius: 0.625rem;
  padding: 0.625rem 0.875rem;
  font-size: 0.875rem;
  color: #e2e8f0;                           /* slate-200 */
  font-family: var(--font-body);
  transition: border-color 0.15s, box-shadow 0.15s;
  outline: none;
}

.field-input::placeholder {
  color: #475569; /* slate-600 */
}

.field-input:focus {
  border-color: rgb(99 102 241 / 0.6);     /* indigo-500/60 */
  box-shadow: 0 0 0 3px rgb(99 102 241 / 0.12);
}

.field-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.field-hint {
  font-size: 0.7rem;
  color: #475569; /* slate-600 */
  text-align: right;
}

/* ── Animations ───────────────────────────────────────────── */
@keyframes fadein {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes slidein {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

.animate-fadein  { animation: fadein  0.5s ease both; }
.animate-slidein { animation: slidein 0.55s ease both; animation-delay: 80ms; }

/* ── Banner transition ────────────────────────────────────── */
.banner-enter-active,
.banner-leave-active { transition: all 0.3s ease; }
.banner-enter-from,
.banner-leave-to     { opacity: 0; transform: translateY(-6px); }
</style>