<script lang="ts">
  export let accounts: any[] = [];
  export let categories: any[] = [];
  export let initialData: any = null;
  export let actionUrl = "/app/transactions/new";
  
  let type = initialData?.type || 'expense';
  
  let amount = initialData?.amount 
    ? new Intl.NumberFormat('id-ID').format(initialData.amount) 
    : '';
  let accountId = initialData?.accountId || (accounts.length > 0 ? accounts[0].id : '');
  let toAccountId = initialData?.toAccountId || (accounts.length > 1 ? accounts[1].id : (accounts.length > 0 ? accounts[0].id : ''));
  
  let filteredCategories = categories.filter(c => c.type === type);
  let categoryName = initialData?.categoryName || (filteredCategories.length > 0 ? filteredCategories[0].name : '');

  let date = initialData?.date 
    ? new Date(initialData.date).toISOString().split('T')[0] 
    : new Date().toISOString().split('T')[0];
  let description = initialData?.description || '';
  
  let isSubmitting = false;

  function setType(t: string) {
    type = t;
    filteredCategories = categories.filter(c => c.type === type);
    if (filteredCategories.length > 0) {
      categoryName = filteredCategories[0].name;
    } else {
      categoryName = '';
    }
  }

  // Format amount input to be numeric only and format as IDR visually if desired, 
  // but for raw input, a simple number field is often faster for 10s entry.
</script>

<form method="POST" action={actionUrl} class="space-y-6" on:submit={() => isSubmitting = true}>
  
  <!-- Type Selector -->
  <div class="flex p-1 bg-surface-hover rounded-md">
    {#each ['expense', 'income', 'transfer'] as t}
      <button 
        type="button" 
        on:click={() => setType(t)}
        class="flex-1 py-1.5 text-sm font-medium rounded capitalize transition-all"
        class:bg-surface={type === t}
        class:shadow-sm={type === t}
        class:text-text-main={type === t}
        class:text-text-muted={type !== t}
      >
        {t}
      </button>
    {/each}
  </div>
  
  <input type="hidden" name="type" value={type} />

  <!-- Amount -->
  <div class="space-y-1.5">
    <label for="amount" class="block text-sm font-medium text-text-main">Amount</label>
    <div class="relative">
      <span class="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">Rp</span>
      <input 
        type="text" 
        inputmode="numeric"
        id="amount" 
        name="amount" 
        bind:value={amount}
        required 
        class="format-idr-input w-full pl-9 pr-3 py-2 bg-transparent border border-border rounded-md focus:outline-none focus:border-text-main focus:ring-1 focus:ring-text-main transition-colors text-sm"
        placeholder="0"
      />
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <!-- Account (From) -->
    <div class="space-y-1.5">
      <label for="accountId" class="block text-sm font-medium text-text-main">
        {type === 'transfer' ? 'From Account' : 'Account'}
      </label>
      <select 
        id="accountId" 
        name="accountId" 
        bind:value={accountId}
        required 
        class="w-full px-3 py-2 bg-transparent border border-border rounded-md focus:outline-none focus:border-text-main focus:ring-1 focus:ring-text-main transition-colors text-sm"
      >
        {#each accounts as acc}
          <option value={acc.id}>{acc.name} ({acc.balance.toLocaleString('id-ID')})</option>
        {/each}
      </select>
    </div>

    <!-- Account (To) - Only for Transfer -->
    {#if type === 'transfer'}
      <div class="space-y-1.5">
        <label for="toAccountId" class="block text-sm font-medium text-text-main">To Account</label>
        <select 
          id="toAccountId" 
          name="toAccountId" 
          bind:value={toAccountId}
          required 
          class="w-full px-3 py-2 bg-transparent border border-border rounded-md focus:outline-none focus:border-text-main focus:ring-1 focus:ring-text-main transition-colors text-sm"
        >
          {#each accounts as acc}
            <option value={acc.id} disabled={acc.id === accountId}>{acc.name}</option>
          {/each}
        </select>
      </div>
    {:else}
      <!-- Category - Only for Income/Expense -->
      <div class="space-y-1.5">
        <label for="categoryName" class="block text-sm font-medium text-text-main">Category</label>
        <input 
          type="text"
          id="categoryName" 
          name="categoryName" 
          list="category-options"
          bind:value={categoryName}
          placeholder="Select or type new..."
          required 
          autocomplete="off"
          class="w-full px-3 py-2 bg-transparent border border-border rounded-md focus:outline-none focus:border-text-main focus:ring-1 focus:ring-text-main transition-colors text-sm"
        />
        <datalist id="category-options">
          {#each filteredCategories as cat}
            <option value={cat.name}></option>
          {/each}
        </datalist>
      </div>
    {/if}
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <!-- Date -->
    <div class="space-y-1.5">
      <label for="date" class="block text-sm font-medium text-text-main">Date</label>
      <input 
        type="date" 
        id="date" 
        name="date" 
        bind:value={date}
        required 
        class="w-full px-3 py-2 bg-transparent border border-border rounded-md focus:outline-none focus:border-text-main focus:ring-1 focus:ring-text-main transition-colors text-sm"
      />
    </div>

    <!-- Note -->
    <div class="space-y-1.5">
      <label for="description" class="block text-sm font-medium text-text-main">Note (Optional)</label>
      <input 
        type="text" 
        id="description" 
        name="description" 
        bind:value={description}
        class="w-full px-3 py-2 bg-transparent border border-border rounded-md focus:outline-none focus:border-text-main focus:ring-1 focus:ring-text-main transition-colors text-sm"
        placeholder="What was this for?"
      />
    </div>
  </div>

  <div class="pt-6 mt-2 border-t border-border flex flex-col sm:flex-row gap-3">
    {#if initialData}
      <button 
        type="submit"
        name="action"
        value="delete"
        formnovalidate
        class="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
        on:click={(e) => {
          if (!confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) e.preventDefault();
        }}
      >
        Hapus Transaksi
      </button>
    {/if}
    <button 
      type="submit" 
      disabled={isSubmitting}
      class="flex-1 bg-accent text-white rounded-md py-2.5 text-sm font-medium hover:bg-accent-hover transition-colors shadow-sm active:scale-[0.98] disabled:opacity-70"
    >
      {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
    </button>
  </div>
</form>
