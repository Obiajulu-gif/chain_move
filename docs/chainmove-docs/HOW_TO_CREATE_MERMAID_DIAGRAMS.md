# How to Create Mermaid Diagrams

This guide explains how to create and use Mermaid diagrams in your Docusaurus documentation.

## What is Mermaid?

Mermaid is a JavaScript-based diagramming and charting tool that uses text-based definitions to create diagrams. It's now properly configured in your Docusaurus site.

## Basic Syntax

To create a Mermaid diagram, wrap your diagram code in a code block with the `mermaid` language identifier:

````markdown
```mermaid
graph TD
    A[Start] --> B[Process]
    B --> C[End]
```
````

## Common Diagram Types

### 1. Flowcharts

```mermaid
graph TD
    A[Smart Contract Features] --> B[VehicleNFT]
    A --> C[InvestmentPool]
    A --> D[RevenueSharing]
    A --> E[Governance]
    
    B --> B1[Mint Vehicle NFTs]
    B --> B2[Transfer Ownership]
    B --> B3[Update Metadata]
    
    C --> C1[Create Pool]
    C --> C2[Invest]
    C --> C3[Withdraw]
    C --> C4[Calculate Returns]
```

### 2. Sequence Diagrams

```mermaid
sequenceDiagram
    participant Driver
    participant Platform
    participant Investor
    participant Blockchain
    
    Driver->>Platform: Apply for financing
    Platform->>Blockchain: Create vehicle NFT
    Blockchain-->>Platform: NFT created
    Platform->>Investor: Investment opportunity
    Investor->>Blockchain: Invest in pool
    Blockchain-->>Investor: Investment confirmed
```

### 3. Class Diagrams

```mermaid
classDiagram
    class VehicleNFT {
        +uint256 vehicleId
        +string make
        +string model
        +uint256 year
        +mint()
        +transfer()
    }
    
    class InvestmentPool {
        +uint256 poolId
        +address vehicle
        +uint256 targetAmount
        +invest()
        +withdraw()
    }
    
    VehicleNFT --> InvestmentPool : creates
```

### 4. State Diagrams

```mermaid
stateDiagram-v2
    [*] --> Applied
    Applied --> Approved : Document verification
    Applied --> Rejected : Insufficient documents
    Approved --> Funded : Investment complete
    Funded --> Active : Vehicle delivered
    Active --> Completed : Loan repaid
    Active --> Defaulted : Payment missed
    Rejected --> [*]
    Completed --> [*]
    Defaulted --> [*]
```

### 5. Pie Charts

```mermaid
pie title Investment Distribution
    "Direct Loans" : 40
    "Lease-to-Own" : 35
    "Luxury Vehicles" : 15
    "Commercial Fleet" : 10
```

### 6. Gantt Charts

```mermaid
gantt
    title ChainMove Development Timeline
    dateFormat  YYYY-MM-DD
    section Phase 1
    Smart Contract Development    :2025-01-01, 2025-02-15
    Frontend Development          :2025-01-15, 2025-03-01
    section Phase 2
    Testing & Security Audit     :2025-02-15, 2025-03-15
    MVP Launch                   :2025-03-15, 2025-04-01
```

## Tips for Better Diagrams

1. **Keep it Simple**: Don't overcomplicate diagrams with too many elements
2. **Use Clear Labels**: Make node and edge labels descriptive
3. **Consistent Styling**: Use consistent colors and shapes for similar elements
4. **Logical Flow**: Ensure the flow direction makes sense (usually top-to-bottom or left-to-right)

## Color and Styling

You can add custom styling to your diagrams:

```mermaid
graph TD
    A[Start] --> B[Process]
    B --> C[Decision]
    C -->|Yes| D[Success]
    C -->|No| E[Error]
    
    classDef success fill:#90EE90
    classDef error fill:#FFB6C1
    classDef process fill:#87CEEB
    
    class D success
    class E error
    class B process
```

## Advanced Features

### Subgraphs

```mermaid
graph TD
    subgraph "Frontend"
        A[React App]
        B[Web3 Integration]
    end
    
    subgraph "Backend"
        C[API Server]
        D[Database]
    end
    
    subgraph "Blockchain"
        E[Smart Contracts]
        F[IPFS Storage]
    end
    
    A --> C
    B --> E
    C --> D
    E --> F
```

## Best Practices

1. **Test your diagrams**: Always preview diagrams before committing
2. **Use meaningful names**: Avoid generic labels like "Node1", "Process2"
3. **Document complex diagrams**: Add explanatory text above or below complex diagrams
4. **Keep diagrams focused**: One diagram should illustrate one concept or process
5. **Update diagrams**: Keep diagrams in sync with code and documentation changes

## Troubleshooting

If your diagrams aren't rendering:

1. Check that the code block uses the `mermaid` language identifier
2. Verify the syntax is correct (use [Mermaid Live Editor](https://mermaid.live) to test)
3. Ensure there are no special characters that might break parsing
4. Check the browser console for any JavaScript errors

For more advanced Mermaid features, visit the [official Mermaid documentation](https://mermaid.js.org/). 