
<script>
  import PageHeader from '$lib/components/dashboard/PageHeader.svelte';
  import CommissionTable from '$lib/components/dashboard/CommissionTable.svelte';
  import {getAllCommissions} from '$lib/data/mockCommissions.js'
    import CommissionDetailModal from '$lib/components/dashboard/CommissionDetailModal.svelte';

  let commissionData = $state(getAllCommissions());
  let selectedCommission = $state(null);

  
 function handleOpenModal(item) { selectedCommission = item; }
  
 function handleCloseModal() { selectedCommission = null; }

 function handleUpdateData(updatedItem) {
    
    commissionData = commissionData.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    );
 }
</script>

<svelte:head>
  <title>Commission Dashboard | Cho's Lazey Studio</title>
</svelte:head>

<CommissionDetailModal 
  commission={selectedCommission} 
  onClose={handleCloseModal} 
onUpdate={handleUpdateData}
/>


<div class="page-container">
    <PageHeader 
        eyebrow="VISUAL COMMISSIONS"
        title="The Open Canvas"
        description="The custom pieces requested by your patrons. Turning thoughts into shared imagery."
    />

    <CommissionTable
        onView={handleOpenModal}
        data={commissionData}
    />
</div>

<style>
  .page-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
</style>
