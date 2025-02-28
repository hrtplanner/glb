<script lang="ts">
    import Modal from "svelte-simple-modal";

    let isMobile = $state(window.innerWidth < 768);

    window.addEventListener('resize', () => {
        isMobile = window.innerWidth < 768;
    });

    let { children } = $props();
</script>

<Modal
    unstyled={true}
    styleWindow={{
        backgroundColor: 'var(--color-bg-secondary)',
        border: '1px solid var(--color-border)',
        color: 'var(--color-fg)',
        maxHeight: 'calc(90vh - 20px)',
        maxWidth: '100vw',
        minWidth: isMobile ? '90vw' : '50vw',
        overflow: 'auto',
        padding: '20px',
        borderRadius: '5px',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, calc(-50% - 20px))',
    }}
    styleBg={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }}
    styleWindowWrap={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
    }}
    closeButton={true}
    styleCloseButton={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        color: 'var(--color-fg)',
        backgroundColor: 'var(--color-bg-tertiary)',
        border: '3px solid var(--color-accent-secondary)',
        borderRadius: '5px',
        padding: '12px',
        cursor: 'pointer',
    }}
>
    {@render children?.()}
</Modal>